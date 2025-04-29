import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { ISchedule, IUser } from './user.interface'
import { Schedule, User } from './user.model'

import { USER_ROLES, USER_STATUS } from '../../../enum/user'
import { generateOtp } from '../../../utils/crypto'
import { emailTemplate } from '../../../shared/emailTemplate'
import { emailHelper } from '../../../helpers/emailHelper'
import { JwtPayload } from 'jsonwebtoken'
import { logger } from '../../../shared/logger'
import { convertScheduleToLocal, formatSchedule } from '../../../utils/date'
import { DateTime } from 'luxon'
import { Bookings } from '../bookings/bookings.model'
import { Types } from 'mongoose'

const createUser = async (payload: IUser): Promise<IUser | null> => {
  //check if user already exist
  payload.email = payload.email?.toLowerCase().trim()
  const isUserExist = await User.findOne({
    email: payload.email,
    status: { $nin: [USER_STATUS.DELETED] },
  })

  if (isUserExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `An account with this email already exist, please login or try with another email.`,
    )
  }

  const user = await User.create([payload])
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user')
  }

  const otp = generateOtp()
  const otpExpiresIn = new Date(Date.now() + 5 * 60 * 1000)
  const authentication = {
    oneTimeCode: otp,
    expiresAt: otpExpiresIn,
    latestRequestAt: new Date(),
    authType: 'createAccount',
  }

  await User.findByIdAndUpdate(
    user[0]._id,
    {
      $set: { authentication },
    },
    { new: true },
  )

  //send email or sms with otp
  const createAccount = emailTemplate.createAccount({
    name: user[0].name!,
    email: user[0].email!,
    otp,
  })

  emailHelper.sendEmail(createAccount)

  return user[0]
}

const updateProfile = async (user: JwtPayload, payload: Partial<IUser>) => {
  // console.log(first)
  const updatedProfile = await User.findByIdAndUpdate(
    new Types.ObjectId(user.authId),
    {
      $set: payload,
    },
    { new: true },
  )

  if (!updatedProfile) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update profile.')
  }

  return 'Profile updated successfully.'
}

const createAdmin = async (): Promise<Partial<IUser> | null> => {
  const admin = {
    email: 'hcf@gmail.com',
    name: 'Andrea',
    password: '12345678',
    role: USER_ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    verified: true,
    authentication: {
      oneTimeCode: null,
      restrictionLeftAt: null,
      expiresAt: null,
      latestRequestAt: new Date(),
      authType: '',
    },
  }

  const isAdminExist = await User.findOne({
    email: admin.email,
    status: { $nin: [USER_STATUS.DELETED] },
  })

  if (isAdminExist) {
    logger.log('info', 'Admin account already exist, skipping creation.🦥')
    return isAdminExist
  }
  const result = await User.create([admin])
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin')
  }
  return result[0]
}

const getUserProfile = async (user: JwtPayload): Promise<IUser | null> => {
  console.log(user)
  const result = await User.findById(user.authId)

  return result
}

const manageSchedule = async (user: JwtPayload, payload: ISchedule) => {
  payload.user = user.authId

  const formattedSchedule = formatSchedule(payload, payload.timeZone)
  const isScheduleExist = await Schedule.findOne({ user: user.authId })

  let schedule
  if (isScheduleExist) {
    schedule = await Schedule.findOneAndUpdate(
      { user: user.authId },
      {
        $set: { schedule: formattedSchedule },
      },
      { new: true },
    )
  }
  if (!isScheduleExist) {
    schedule = await Schedule.create([
      {
        user: user.authId,
        timeZone: payload.timeZone, //add timeZone to sche
        schedule: formattedSchedule,
      },
    ])
  }

  return schedule
}

const getSchedule = async (user: JwtPayload) => {
  const schedule = await Schedule.findOne({ user: user.authId }).lean()
  if (!schedule) return []
  const localTimeSchedule = convertScheduleToLocal(schedule, schedule?.timeZone)
  return localTimeSchedule
}

const getAvailableTime = async (
  user: JwtPayload,
  date: string,
  timezone: string,
) => {
  const selectedDate = DateTime.fromFormat(date, 'yyyy-MM-dd')
  // Get the day name (Monday, Tuesday, etc.) from the selected date
  const selectedDayName = selectedDate.weekdayLong

  const [bookings, schedules] = await Promise.all([
    Bookings.find({ user: user.authId, date: selectedDate.toJSDate() }).lean(),
    Schedule.find({}).lean(),
  ])

  if (!schedules || schedules.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Schedule not found')
  }

  const localTimeSchedule = convertScheduleToLocal(
    {
      user: schedules[0].user,
      timeZone: schedules[0].timeZone,
      schedule: schedules[0].schedule,
    },
    timezone,
  )
  console.log(selectedDayName)
  // Filter to only include the selected day
  const selectedDaySchedule = localTimeSchedule.filter(
    slot => slot.day.toLowerCase() === selectedDayName?.toLocaleLowerCase(),
  )

  if (selectedDaySchedule.length === 0) {
    return [] // No schedule available for the selected day
  }

  // Map the slots for the selected day only
  const slots = selectedDaySchedule.map(slot => {
    return {
      user: schedules[0].user,
      day: slot.day,
      times: slot.times.map(time => {
        return {
          time: time.time,
          timeCode: time.timeCode,
          isBooked: bookings.some(
            booking => booking.timeCode === time.timeCode,
          ),
        }
      }),
    }
  })

  return slots
}

const getALlUsers = async () => {
  const result = await User.find({ status: { $nin: [USER_STATUS.DELETED] } })
  return result
}

// const updateUser = async (

export const UserServices = {
  createUser,
  updateProfile,
  createAdmin,
  getUserProfile,
  manageSchedule,
  getSchedule,
  getAvailableTime,
  getALlUsers,
}
