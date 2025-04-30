import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IBookings } from './bookings.interface'
import { Bookings } from './bookings.model'
import {
  convertSessionTimeToLocal,
  convertSessionTimeToUTC,
} from '../../../utils/date'
import { JwtPayload } from 'jsonwebtoken'
import { sendNotification } from '../../../helpers/notificationHelper'
import { User } from '../user/user.model'
import { USER_ROLES } from '../../../enum/user'
import { BOOKING_STATUS, PAYMENT_METHOD } from '../../../enum/booking'

const createBookings = async (
  user: JwtPayload,
  payload: IBookings & { time: string; date: string },
) => {
  //format the date

  const convertedSlotToUtc = convertSessionTimeToUTC(
    payload.time,
    payload.timezone,
    payload.date,
  )

  const convertedScheduleDate = new Date(convertedSlotToUtc.isoString)

  payload.user = user.authId
  payload.scheduledAt = convertedScheduleDate
  const result = await Bookings.create(payload)
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Bookings')

  const admin = await User.findOne({ role: USER_ROLES.ADMIN })

  await sendNotification(
    user.authId,
    admin?._id as unknown as string,
    'New Booking Request',
    `A new booking request has been made by ${user.name}`,
  )

  return result
}

const getAllBookings = async () => {
  const result = await Bookings.find().populate('service', {
    title: 1,
    image: 1,
  })
  console.log(result)

  return result
}

const getUSerWiseBookings = async (user: JwtPayload) => {
  const result = await Bookings.find({ user: user.authId }).populate(
    'service',
    { title: 1, image: 1 },
  )
  return result
}

const getSingleBookings = async (id: string) => {
  const result = await Bookings.findById(id)
  return result
}

const updateBookings = async (
  user: JwtPayload,
  id: string,
  payload: Partial<IBookings & { date: string; time: string }>,
) => {
  const [isBookingExist, admin] = await Promise.all([
    Bookings.findById(id).populate<{ user: { name: string } }>('user', {
      name: 1,
    }),
    User.findOne({ role: USER_ROLES.ADMIN }),
  ])

  if (!admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Admin not found')
  }
  if (!isBookingExist)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Booking not found')

  let notificationTitle = ''
  let notificationBody = ''

  if (payload.date && payload.time && user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Only admin can change the date and time of the scheduled time, please contact with admin.',
    )
  }

  //notification receiver local time for booking
  let userLocalTime = convertSessionTimeToLocal(
    isBookingExist.scheduledAt,
    isBookingExist.timezone,
  )

  if (payload.date && payload.time) {
    const convertedSlotToUtc = convertSessionTimeToUTC(
      payload.time,
      isBookingExist.timezone,
      payload.date,
    )
    const convertedScheduleDate = new Date(convertedSlotToUtc.isoString)
    payload.scheduledAt = convertedScheduleDate
    userLocalTime = convertSessionTimeToLocal(
      convertedScheduleDate,
      isBookingExist.timezone,
    )
    notificationTitle = 'Booking Date & Time Changed'
    notificationBody = `Booking date & time has been changed by ${isBookingExist.user}`
  }

  if (payload.link) {
    notificationTitle = `Meeting link is created by ${admin.name}`
    notificationBody = `Meeting link is created by ${admin.name}, please check your dashboard or email to get the meeting link and join at ${userLocalTime}`
  }

  if (
    payload.status === BOOKING_STATUS.ACCEPTED ||
    payload.status === BOOKING_STATUS.CANCELLED
  ) {
    notificationTitle = `Booking has been ${payload.status} by ${payload.status === BOOKING_STATUS.ACCEPTED ? admin.name : isBookingExist.user.name}`
    notificationBody = `Booking has been accepted by ${payload.status === BOOKING_STATUS.ACCEPTED ? admin.name : isBookingExist.user.name}`
  }
  if (
    payload.paymentRequired &&
    payload.paymentMethod === PAYMENT_METHOD.ONLINE
  ) {
    notificationTitle = `Payment is required for booking.`
    notificationBody = `Please pay the amount of ${isBookingExist.fee} for booking that is scheduled at ${userLocalTime}`
  }

  const result = await Bookings.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  )

  //send notification to user
  sendNotification(
    admin?._id as unknown as string,
    isBookingExist?.user as unknown as string,
    notificationTitle,
    notificationBody,
  )
  return result
}

const deleteBookings = async (id: string) => {
  const result = await Bookings.findByIdAndDelete(id)
  return result
}

export const BookingsServices = {
  createBookings,
  getAllBookings,
  getSingleBookings,
  updateBookings,
  deleteBookings,
  getUSerWiseBookings,
}
