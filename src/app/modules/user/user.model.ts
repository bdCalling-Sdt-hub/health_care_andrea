import { Schema, model } from 'mongoose'
import { ISchedule, IUser, ScheduleModel, UserModel } from './user.interface'
import { USER_ROLES, USER_STATUS } from '../../../enum/user'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import config from '../../../config'
import bcrypt from 'bcrypt'

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: [USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED, USER_STATUS.DELETED],
      default: USER_STATUS.ACTIVE,
    },
    industry: {
      type: String,
    },
    serviceTypes: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: USER_ROLES.USER,
    },
    appId: {
      type: String,
    },
    deviceToken: {
      type: String,
    },
    authentication: {
      _id: false,
      select: false,
      type: {
        restrictionLeftAt: {
          type: Date,
          default: null,
        },
        resetPassword: {
          type: Boolean,
          default: false,
        },
        wrongLoginAttempts: {
          type: Number,
          default: 0,
        },
        passwordChangedAt: {
          type: Date,
          default: null,
        },
        oneTimeCode: {
          type: String,
          default: null,
        },
        latestRequestAt: {
          type: Date,
          default: null,
        },
        expiresAt: {
          type: Date,
          default: null,
        },
        requestCount: {
          type: Number,
          default: 0,
        },
        authType: {
          type: String,
          default: null,
        },
      },
    },
  },
  {
    timestamps: true,
  },
)

// Define the TimeSlot schema

const TimeSlotSchema = new Schema(
  {
    time: {
      type: String,
      required: true,
    },
    timeCode: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
)

const DayScheduleSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
    },
    times: [TimeSlotSchema],
  },
  { _id: false },
)

const ScheduleSchema = new Schema<ISchedule, ScheduleModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    },
    schedule: [DayScheduleSchema],
  },
  { timestamps: true },
)

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

userSchema.pre<IUser>('save', async function (next) {
  //find the user by email
  const isExist = await User.findOne({
    email: this.email,
    status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED] },
  })
  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'An account with this email already exists',
    )
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

export const User = model<IUser, UserModel>('User', userSchema)
export const Schedule = model<ISchedule, ScheduleModel>(
  'Schedule',
  ScheduleSchema,
)
