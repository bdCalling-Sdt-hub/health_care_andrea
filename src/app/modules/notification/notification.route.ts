import express from 'express';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.post('/', NotificationController.createNotification);
router.get('/', NotificationController.getAllNotifications);
router.get('/:id', NotificationController.getSingleNotification);
router.patch('/:id', NotificationController.updateNotification);
router.delete('/:id', NotificationController.deleteNotification);

export const NotificationRoutes = router;
