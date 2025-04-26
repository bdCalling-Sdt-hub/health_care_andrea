import express from 'express'
import { PaymentController } from './payment.controller'
import { USER_ROLES } from '../../../enum/user'
import auth from '../../middleware/auth'

const router = express.Router()

// Create checkout session for a booking
router.post(
  '/create-checkout-session/:bookingId',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  PaymentController.createCheckoutSession,
)

// Handle Stripe webhook

// Get payment by booking ID
router.get(
  '/booking/:bookingId',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  PaymentController.getPaymentByBookingId,
)

router.get(
  '/my-payments',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  PaymentController.getPaymentByUserId,
)
// Get all payments
router.get('/', auth(USER_ROLES.ADMIN), PaymentController.getAllPayments)

export const PaymentRoutes = router
