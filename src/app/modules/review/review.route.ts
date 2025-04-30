import express from 'express'
import { ReviewController } from './review.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { ReviewValidations } from './review.validation'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(ReviewValidations.create),
  ReviewController.createReview,
)
router.get('/', ReviewController.getAllReviews)
router.get('/:id', ReviewController.getSingleReview)
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(ReviewValidations.update),
  ReviewController.updateReview,
)
router.delete('/:id', auth(USER_ROLES.ADMIN), ReviewController.deleteReview)

export const ReviewRoutes = router
