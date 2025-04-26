import { Model, Types } from 'mongoose'

export interface IBookings {
  user: Types.ObjectId
  firstName: string
  lastName?: string
  contact: string
  email: string
  industry: string
  country: string
  state: string
  service: Types.ObjectId
  mode: string
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
}

export type BookingsModel = Model<IBookings>
