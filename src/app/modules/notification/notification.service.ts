import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { INotification } from './notification.interface'
import { Notification } from './notification.model'
import { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'

const getNotifications = (user: JwtPayload) => {
  const result = Notification.find({ user: user.authId })
    .populate('receiver', 'name image')
    .populate('sender', 'name image')
    .lean()
  return result
}

const readNotification = async (id: string) => {
  const result = await Notification.findByIdAndUpdate(
    new Types.ObjectId(id),
    { isRead: true },
    { new: true },
  )
  return result
}

export const NotificationServices = {
  getNotifications,
  readNotification,
}
