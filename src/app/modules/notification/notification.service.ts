import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';

const createNotification = async (payload: INotification) => {
  const result = await Notification.create(payload);
  if (!result)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create Notification',
    );
  return result;
};

const getAllNotifications = async () => {
  const result = await Notification.find();
  return result;
};

const getSingleNotification = async (id: string) => {
  const result = await Notification.findById(id);
  return result;
};

const updateNotification = async (
  id: string,
  payload: Partial<INotification>,
) => {
  const result = await Notification.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  );
  return result;
};

const deleteNotification = async (id: string) => {
  const result = await Notification.findByIdAndDelete(id);
  return result;
};

export const NotificationServices = {
  createNotification,
  getAllNotifications,
  getSingleNotification,
  updateNotification,
  deleteNotification,
};
