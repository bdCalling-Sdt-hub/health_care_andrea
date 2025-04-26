import { Model, Types } from 'mongoose'

type IAuthentication = {
  restrictionLeftAt: Date | null
  resetPassword: boolean
  wrongLoginAttempts: number
  passwordChangedAt?: Date
  oneTimeCode: string
  latestRequestAt: Date
  expiresAt?: Date
  requestCount?: number
  authType?: 'createAccount' | 'resetPassword'
}

export type IUser = {
  _id: Types.ObjectId
  name: string
  industry?: string
  email?: string
  serviceTypes: string
  profile?: string
  location: string
  phone: string
  status: string
  verified: boolean
  about: string
  
  address?: string
  password: string
  role: string
  appId?: string
  deviceToken?: string
  authentication: IAuthentication
  createdAt: Date
  updatedAt: Date
}

export type TimeSlot = {
  time: string
  timeCode: number
}
export type DaySchedule = {
  day: string
  times: TimeSlot[]
}
export type ISchedule = {
  user: Types.ObjectId
  timeZone: string
  schedule: DaySchedule[]
}

export type UserModel = {
  isPasswordMatched: (
    givenPassword: string,
    savedPassword: string,
  ) => Promise<boolean>
} & Model<IUser>

export type ScheduleModel = Model<ISchedule>
