import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import {
  ICreateCheckoutSession,
  IPayment,
  IStripeWebhookEvent,
} from './payment.interface'
import { Payment } from './payment.model'
import Stripe from 'stripe'
import config from '../../../config'
import { Bookings } from '../bookings/bookings.model'
import { BOOKING_STATUS } from '../../../enum/booking'
import { User } from '../user/user.model'
import { emailHelper } from '../../../helpers/emailHelper'
import { emailTemplate } from '../../../shared/emailTemplate'
import { Types } from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { USER_ROLES } from '../../../enum/user'

// Initialize Stripe with your secret key
const stripe = new Stripe(config.stripe.secretKey as string, {
  //   apiVersion: '2023-10-16', // Use the latest API version
})

const createPayment = async (payload: IPayment): Promise<IPayment> => {
  const result = await Payment.create(payload)
  if (!result)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create payment record',
    )
  return result
}

const createCheckoutSession = async (user: JwtPayload, bookingId: string) => {
  try {
    // Check if booking exists and requires payment
    const [isUserExist, booking] = await Promise.all([
      User.findById(user.authId),
      Bookings.findById(bookingId),
    ])

    if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    if (!booking) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found')
    }

    if (!booking.paymentRequired) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Only bookings that require payment can be processed',
      )
    }

    if (!booking.fee) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'No fee specified for this booking, payment is not required. Please contact with the admin for further assistance.',
      )
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: user.name || 'Healthcare Booking',
              description: 'Booking fee for Healthcare Financial Consultation.',
            },
            unit_amount: Math.round(booking.fee * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'DHONNOBAD_ABAR_ASHBEN',
      cancel_url: 'GORIB_TUI_TAKA_NA_DIYE_CHOLE_GELI',
      customer_email: user.email,
      metadata: {
        bookingId: booking._id.toString(),
        userId: user.authId,
      },
    })

    // Create a payment record in pending state
    await createPayment({
      booking: new Types.ObjectId(bookingId),
      user: new Types.ObjectId(isUserExist._id),
      amount: booking.fee,
      currency: 'usd',
      status: 'pending',
      paymentMethod: 'stripe',
      stripeSessionId: session.id,
      metadata: {
        checkoutSessionId: session.id,
      },
    })

    return {
      sessionId: session.id,
      sessionUrl: session.url,
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create checkout session',
    )
  }
}

const handleWebhookEvent = async (event: IStripeWebhookEvent) => {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleSuccessfulPayment(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    return { received: true }
  } catch (error) {
    console.error('Webhook error:', error)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to process webhook event',
    )
  }
}

const handleSuccessfulPayment = async (session: any) => {
  // Find the payment record by session ID
  const payment = await Payment.findOne({
    stripeSessionId: session.id,
  }).populate<{ user: { email: string; name: string } }>('user', {
    email: 1,
    name: 1,
  })

  if (!payment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Payment record not found')
  }

  // Update payment status
  payment.status = 'completed'
  payment.paymentIntentId = session.payment_intent
  await payment.save()

  // Update booking status
  const booking = await Bookings.findByIdAndUpdate(
    payment.booking,
    {
      $set: {
        status: BOOKING_STATUS.PAID,
        // status: BOOKING_STATUS.CONFIRMED,
      },
    },
    { new: true },
  )
    .populate<{ user: { name: string; email: string } }>('user')
    .populate<{ service: { title: 1 } }>('service', { title: 1 })

  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found')
  }

  // Get admin user for notification
  const admin = await User.findOne({ role: USER_ROLES.ADMIN })

  // Send confirmation email to user
  if (booking.user && typeof booking.user !== 'string') {
    const userEmail = payment.user.email
    const userName = payment.user.name

    if (userEmail) {
      const paymentConfirmationEmail = {
        to: userEmail,
        subject: 'Payment Confirmation - Healthcare Booking',
        html: `
          <h1>Payment Confirmation</h1>
          <p>Dear ${userName},</p>
          <p>Your payment of $${payment.amount} for booking #${booking._id} has been successfully processed.</p>
          <p>Booking details:</p>
          <ul>
            <li>Service: ${booking.service?.title || 'Healthcare Service'}</li>
            <li>Date: ${new Date(booking.scheduledAt).toLocaleDateString()}</li>
            <li>Time: ${new Date(booking.scheduledAt).toLocaleTimeString()}</li>
          </ul>
          <p>Thank you for your payment!</p>
        `,
      }

      emailHelper.sendEmail(paymentConfirmationEmail)
    }
  }

  // Send notification to admin
  if (admin && admin.email) {
    const adminNotificationEmail = {
      to: admin.email,
      subject: 'New Payment Received - Healthcare Booking',
      html: `
        <h1>New Payment Received</h1>
        <p>A new payment has been received:</p>
        <ul>
          <li>Booking ID: ${booking._id}</li>
          <li>Amount: $${payment.amount}</li>
          <li>User: ${booking.user?.name || 'User'}</li>
          <li>Service: ${booking.service?.title || 'Healthcare Service'}</li>
          <li>Date: ${new Date(booking.scheduledAt).toLocaleDateString()}</li>
        </ul>
      `,
    }

    emailHelper.sendEmail(adminNotificationEmail)
  }

  return payment
}

const handleFailedPayment = async (paymentIntent: any) => {
  // Find the payment record by payment intent ID
  const payment = await Payment.findOne({
    paymentIntentId: paymentIntent.id,
  })

  if (!payment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Payment record not found')
  }

  // Update payment status
  payment.status = 'failed'
  await payment.save()

  // Update booking status
  await Bookings.findByIdAndUpdate(payment.booking, {
    $set: {
      paymentStatus: 'failed',
    },
  })

  return payment
}

const getPaymentByBookingId = async (
  bookingId: string,
): Promise<IPayment | null> => {
  const payment = await Payment.findOne({
    booking: new Types.ObjectId(bookingId),
  })
  return payment
}

const getPaymentsByUser = async (user: JwtPayload) => {
  const payments = await Payment.find({
    user: new Types.ObjectId(user.authId),
  }).populate<{
    booking: {
      scheduledAt: Date
      service: { title: string }
    }
  }>({
    path: 'booking',
    select: 'service scheduledAt',
    populate: [
      {
        path: 'service',
        select: 'title',
      },
    ],
  })

  return payments
}

const getAllPayments = async () => {
  const payments = await Payment.find({})
    .populate({ path: 'user', select: { name: 1 } })
    .populate<{
      booking: {
        scheduledAt: Date
        service: { title: string }
      }
    }>({
      path: 'booking',
      select: 'service scheduledAt',
      populate: [
        {
          path: 'service',
          select: 'title',
        },
      ],
    })
  return payments
}

export const PaymentServices = {
  createPayment,
  createCheckoutSession,
  handleWebhookEvent,
  getPaymentByBookingId,
  getPaymentsByUser,
  getAllPayments,
}
