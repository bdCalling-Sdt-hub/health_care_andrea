import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { PaymentServices } from './payment.service'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'
import config from '../../../config'
import Stripe from 'stripe'
import { IStripeWebhookEvent } from './payment.interface'

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const { bookingId } = req.params
    const { user } = req.body

    const result = await PaymentServices.createCheckoutSession(user, bookingId)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Checkout session created successfully',
      data: result,
    })
  },
)

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const stripe = new Stripe(config.stripe.secretKey as string, {
    apiVersion: '2025-03-31.basil',
  })

  const signature = req.headers['stripe-signature'] as string

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.webhookSecret as string,
    )

    await PaymentServices.handleWebhookEvent(event as IStripeWebhookEvent)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Webhook handled successfully',
      data: { received: true },
    })
  } catch (err) {
    //@ts-ignore
    console.error(`Webhook Error: ${err.message}`)
    //@ts-ignore
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

const getPaymentByBookingId = catchAsync(
  async (req: Request, res: Response) => {
    const { bookingId } = req.params
    const result = await PaymentServices.getPaymentByBookingId(bookingId)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Payment retrieved successfully',
      data: result,
    })
  },
)

const getPaymentByUserId = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getPaymentsByUser(req.user!)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  })
})

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getAllPayments()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  })
})

export const PaymentController = {
  createCheckoutSession,
  handleWebhook,
  getPaymentByBookingId,
  getPaymentByUserId,
  getAllPayments,
}
