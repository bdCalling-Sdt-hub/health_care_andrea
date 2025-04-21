import express from 'express'
import { ServiceController } from './service.controller'
import { USER_ROLES } from '../../../enum/user'
import auth from '../../middleware/auth'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'
import { ServiceValidations } from './service.validation'
import validateRequest from '../../middleware/validateRequest'

const router = express.Router()

router.post(
  '/create-service',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(ServiceValidations.createServiceZodSchema),
  ServiceController.createService,
)
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(ServiceValidations.updateServiceZodSchema),
  ServiceController.updateService,
)
router.get('/:id', ServiceController.getService)
router.delete('/:id', auth(USER_ROLES.ADMIN), ServiceController.deleteService)
router.get('/', ServiceController.getAllServices)

export const ServiceRoutes = router
