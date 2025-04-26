import express from 'express'
import { NotificationController } from './notification.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'

const router = express.Router()
router.get(
  '/',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  NotificationController.getMyNotifications,
)
router.get('/:id', NotificationController.updateNotification)
export const NotificationRoutes = router
