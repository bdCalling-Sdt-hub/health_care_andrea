import express from 'express'
import { PublicController } from './public.controller'
import validateRequest from '../../middleware/validateRequest'
import { PublicValidation } from './public.validation'
import { USER_ROLES } from '../../../enum/user'
import auth from '../../middleware/auth'

const router = express.Router()

router.post(
  '/',
  validateRequest(PublicValidation.create),
  PublicController.createPublic,
)
router.get('/:type', PublicController.getAllPublics)

router.delete('/:id', PublicController.deletePublic)
router.post(
  '/contact',
  validateRequest(PublicValidation.contactZodSchema),
  PublicController.createContact,
)

router.post(
  '/information',
  auth(USER_ROLES.ADMIN),
  PublicController.createOrUpdatePublicInformation,
)
router.get('/information/get', PublicController.getPublicInformation)

export const PublicRoutes = router
