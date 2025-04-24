import { Schema, model } from 'mongoose'
import { IBookings, BookingsModel } from './bookings.interface'

const bookingsSchema = new Schema<IBookings, BookingsModel>(
  {
    user: { type: Schema.Types.ObjectId },
    firstName: { type: String },
    lastName: { type: String },
    contact: { type: String },
    email: { type: String },
    industry: { type: String },
    country: { type: String },
    state: { type: String },
    service: { type: Schema.Types.ObjectId },
    mode: { type: String },
    message: { type: String },
    scheduledAt: { type: Date },
    time: { type: String },
    timeCode: { type: Number },
    status: { type: String },
    fee: { type: Number },
    paymentMethod: { type: String },
    paymentRequired: { type: Boolean },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  },
)

export const Bookings = model<IBookings, BookingsModel>(
  'Bookings',
  bookingsSchema,
)
