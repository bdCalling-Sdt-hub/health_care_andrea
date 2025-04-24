import express from 'express'
import { InsightsController } from './insights.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'

import { InsightsValidations } from './insights.validation'
import validateRequest from '../../middleware/validateRequest'

const router = express.Router()

router.post(
  '/create',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(InsightsValidations.createInsightsZodSchema),
  InsightsController.createInsights,
)

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(InsightsValidations.updateInsightsZodSchema),
  InsightsController.updateInsights,
)
router.get('/:id', InsightsController.getSingleInsights)
router.delete('/:id', auth(USER_ROLES.ADMIN), InsightsController.deleteInsights)
router.get('/', InsightsController.getAllInsights)

router.post(
  '/sections/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(InsightsValidations.createSectionZodSchema),
  InsightsController.createInsightSection,
)
//get all sections by insight id
router.get('/sections/:id', InsightsController.getInsightSections)
router.patch(
  '/sections/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(InsightsValidations.updateSectionZodSchema),
  InsightsController.updateInsightSection,
)

router.delete(
  '/sections/:id',
  auth(USER_ROLES.ADMIN),
  InsightsController.deleteInsightSection,
)
router.post(
  '/sections/bars/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(InsightsValidations.createBarZodSchema),
  InsightsController.createBar,
)

router.patch(
  '/sections/bars/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(InsightsValidations.updateBarZodSchema),
  InsightsController.updateBar,
)

router.delete(
  '/sections/bars/:id',
  auth(USER_ROLES.ADMIN),
  InsightsController.deleteBar,
)

router.get('/sections/bars/:id', InsightsController.getAllBarsBySectionId)

export const InsightsRoutes = router
