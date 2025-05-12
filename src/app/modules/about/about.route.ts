import express from 'express'
import { AboutController } from './about.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { AboutValidations } from './about.validation'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(AboutValidations.create),
  AboutController.createAbout,
)
router.get('/', AboutController.getAllAbout)
router.get('/:id', AboutController.getSingleAbout)
router.patch('/:id', AboutController.updateAbout)
router.delete('/:id', AboutController.deleteAbout)

export const AboutRoutes = router
