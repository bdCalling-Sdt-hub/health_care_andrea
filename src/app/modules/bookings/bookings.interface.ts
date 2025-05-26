import { Model, Types } from 'mongoose'

export interface IMeetingDetails {
  meetingId: string
  password: string
  joinUrl: string
  startUrl: string
  meetingTime: Date
}

export interface IBookings {
  user?: Types.ObjectId
  firstName: string
  lastName?: string
  contact: string
  email: string
  industry: string
  country: string
  state: string
  service: Types.ObjectId
  note: string
  message: string
  scheduledAt: Date
  timeCode: number
  status: string
  fee: number
  link: string
  time: string
  timezone: string
  paymentMethod: string
  paymentRequired: boolean
  createdAt: Date
  updatedAt: Date
  meetingDetails?: IMeetingDetails
}

export type BookingsModel = Model<IBookings>
