import { Request, Response } from 'express';
  import { NotificationServices } from './notification.service';
  import catchAsync from '../../../shared/catchAsync';
  import sendResponse from '../../../shared/sendResponse';
  import { StatusCodes } from 'http-status-codes';
  
  const createNotification = catchAsync(async (req: Request, res: Response) => {
    const notificationData = req.body;
    const result = await NotificationServices.createNotification(notificationData);
    
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Notification created successfully',
      data: result,
    });
  });
  
  const updateNotification = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const notificationData = req.body;
    const result = await NotificationServices.updateNotification(id, notificationData);
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notification updated successfully',
      data: result,
    });
  });
  
  const getSingleNotification = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await NotificationServices.getSingleNotification(id);
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notification retrieved successfully',
      data: result,
    });
  });
  
  const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationServices.getAllNotifications();
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notifications retrieved successfully',
      data: result,
    });
  });
  
  const deleteNotification = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await NotificationServices.deleteNotification(id);
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notification deleted successfully',
      data: result,
    });
  });
  
  export const NotificationController = {
    createNotification,
    updateNotification,
    getSingleNotification,
    getAllNotifications,
    deleteNotification,
  };