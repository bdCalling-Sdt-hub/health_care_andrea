import { Notification } from '../app/modules/notification/notification.model'
import { logger } from '../shared/logger'
import { socket } from '../utils/init.socket'

export const sendNotification = async (
  sender: string,
  receiver: string,
  title: string,
  body: string,
) => {
  try {
    const result = await Notification.create({
      sender,
      receiver,
      title,
      body,
      isRead: false,
    })

    if (!result) logger.warn('Notification not sent')

    const populatedResult = (
      await result.populate('sender', { profile: 1, name: 1 })
    ).populate('receiver', { profile: 1, name: 1 })

    socket.emit('notification', populatedResult)
  } catch (err) {
    //@ts-ignore
    logger.error(err, 'FROM NOTIFICATION HELPER')
  }
}
