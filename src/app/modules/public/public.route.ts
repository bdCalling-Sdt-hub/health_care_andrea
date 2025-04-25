import express from 'express'
import { PublicController } from './public.controller'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { PublicValidations } from './public.validation'
import auth from '../../middleware/auth'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(PublicValidations.create),
  PublicController.createPublic,
)
router.get('/:type', PublicController.getAllPublics)

router.delete('/:id', auth(USER_ROLES.ADMIN), PublicController.deletePublic)

export const PublicRoutes = router
