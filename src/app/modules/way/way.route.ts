import express from 'express'
import { WayController } from './way.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'
import validateRequest from '../../middleware/validateRequest'
import { WayValidation } from './way.validation'

const router = express.Router()

router.post(
  '/create-way',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(WayValidation.createWayZodSchema),
  WayController.createWay,
)
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(WayValidation.updateWayZodSchema),
  WayController.updateWay,
)
router.delete('/:id', auth(USER_ROLES.ADMIN), WayController.deleteWay)
router.get('/:id', WayController.getSingleWay)
router.get('/', WayController.getAllWays)
export const WayRoutes = router
