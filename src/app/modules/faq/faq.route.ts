import express from 'express'
import { FaqController } from './faq.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { FaqValidations } from './faq.validation'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(FaqValidations.create),
  FaqController.createFaq,
)
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(FaqValidations.update),
  FaqController.updateFaq,
)
router.get('/', FaqController.getAllFaqs)
router.get('/:id', FaqController.getSingleFaq)
router.delete('/:id', auth(USER_ROLES.ADMIN), FaqController.deleteFaq)

export const FaqRoutes = router
