import express from 'express'
import { HealthcareconsultantController } from './healthcareconsultant.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { HcValidation } from './healthcareconsultant.validation'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(HcValidation.createHcZodSchema),
  HealthcareconsultantController.createHealthcareconsultant,
)
router.get('/', HealthcareconsultantController.getAllHealthcareconsultants)
router.get('/:id', HealthcareconsultantController.getSingleHealthcareconsultant)
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(HcValidation.updateHCZodSchema),
  HealthcareconsultantController.updateHealthcareconsultant,
)
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN),
  HealthcareconsultantController.deleteHealthcareconsultant,
)

export const HealthcareconsultantRoutes = router
