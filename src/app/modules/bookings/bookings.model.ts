import { Schema, model } from 'mongoose'
import { IBookings, BookingsModel } from './bookings.interface'
import { BOOKING_STATUS, PAYMENT_METHOD } from '../../../enum/booking'

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
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    note: { type: String },
    message: { type: String },
    scheduledAt: { type: Date },
    timeCode: { type: Number },
    timezone: { type: String },
    status: {
      type: String,
      enum: [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.COMPLETED,
        BOOKING_STATUS.CANCELLED,
        BOOKING_STATUS.ACCEPTED,
        BOOKING_STATUS.POSTPONED,
        BOOKING_STATUS.PAID,
      ],
      default: BOOKING_STATUS.PENDING,
    },
    link: { type: String },
    fee: { type: Number },
    paymentMethod: {
      type: String,
      enum: [PAYMENT_METHOD.MANUAL, PAYMENT_METHOD.ONLINE],
    },
    paymentRequired: { type: Boolean, default: false },
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
