import { Request, Response } from 'express'
import { NotificationServices } from './notification.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationServices.getNotifications(req.user!)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result,
  })
})
const updateNotification = catchAsync(async (req: Request, res: Response) => {
  const notificationId = req.params.id
  const result = await NotificationServices.readNotification(notificationId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notifications updated successfully',
    data: result,
  })
})

export const NotificationController = {
  getMyNotifications,
  updateNotification,
}
