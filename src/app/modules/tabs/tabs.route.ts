import express from 'express'
import { TabsController } from './tabs.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'
import validateRequest from '../../middleware/validateRequest'
import { TabValidation } from './tabs.validation'

const router = express.Router()

router.post(
  '/create-tabs',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(TabValidation.createTabZodSchema),
  TabsController.createTab,
)
router.get('/all', TabsController.getAllTabsForSearch)
router.get('/:id', TabsController.getSingleTab)
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(TabValidation.updateTabZodSchema),
  TabsController.updateTab,
)
router.delete('/:id', TabsController.deleteTab)
router.get('/service/:id', TabsController.getAllTabs)
export const TabsRoutes = router
