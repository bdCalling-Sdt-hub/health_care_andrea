import { Model, Types } from 'mongoose'

export type IBookings = {
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
  time: string
  timeCode: number
  status: string
  fee: number
  paymentMethod: string
  paymentRequired: boolean
  createdAt: Date
  updatedAt: Date
}

export type BookingsModel = Model<IBookings>
