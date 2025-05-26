import express from 'express'
import { BookingsController } from './bookings.controller'
import { USER_ROLES } from '../../../enum/user'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { BookingsValidations } from './bookings.validation'

const router = express.Router()

router.post(
  '/',
  validateRequest(BookingsValidations.create),
  BookingsController.createBookings,
)

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(BookingsValidations.update),
  BookingsController.updateBookings,
)

router.get(
  '/my-bookings',
  auth(USER_ROLES.USER),
  BookingsController.getUSerWiseBookings,
)
router.get('/', auth(USER_ROLES.ADMIN), BookingsController.getAllBookings)
router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  BookingsController.getSingleBookings,
)
router.delete('/:id', BookingsController.deleteBookings)

export const BookingsRoutes = router
