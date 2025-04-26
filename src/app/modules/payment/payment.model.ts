import { Schema, model } from 'mongoose'
import { IPayment } from './payment.interface'

const PaymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
    stripeSessionId: {
      type: String,
    },
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

export const Payment = model<IPayment>('Payment', PaymentSchema)
