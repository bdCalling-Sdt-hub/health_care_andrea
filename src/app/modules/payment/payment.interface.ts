import { Types } from 'mongoose'

export interface IPayment {
  booking: Types.ObjectId
  user: Types.ObjectId
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  paymentMethod: string
  paymentIntentId?: string
  stripeSessionId?: string
  metadata?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export interface ICreateCheckoutSession {
  bookingId: string
  userId: string
  amount: number
  name: string
  email: string
  description: string
  successUrl: string
  cancelUrl: string
}

export interface IStripeWebhookEvent {
  id: string
  object: string
  api_version: string
  data: {
    object: any
  }
  type: string
}
