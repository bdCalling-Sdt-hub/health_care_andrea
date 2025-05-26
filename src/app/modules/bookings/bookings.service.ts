import { PAYMENT_METHOD } from './../../../enum/booking'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IBookings } from './bookings.interface'
import { Bookings } from './bookings.model'
import {
  convertSessionTimeToLocal,
  convertSessionTimeToLocalISO,
  convertSessionTimeToUTC,
} from '../../../utils/date'
import { Jwt, JwtPayload } from 'jsonwebtoken'
import { sendNotification } from '../../../helpers/notificationHelper'
import { User } from '../user/user.model'
import { USER_ROLES } from '../../../enum/user'
import { BOOKING_STATUS } from '../../../enum/booking'
import { createZoomMeeting } from '../../../helpers/zoomHelper'
import { Service } from '../service/service.model'
import { emailHelper } from '../../../helpers/emailHelper'
import { emailTemplate } from '../../../shared/emailTemplate'

const createBookings = async (
  payload: IBookings & { time: string; date: string },
) => {
  const convertedSlotToUtc = convertSessionTimeToUTC(
    payload.time,
    payload.timezone,
    payload.date,
  )

  const convertedScheduleDate = new Date(convertedSlotToUtc.isoString)

  payload.scheduledAt = convertedScheduleDate

  const result = await Bookings.create(payload)
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Bookings')

  const [admin, service] = await Promise.all([
    User.findOne({ role: USER_ROLES.ADMIN }),
    Service.findById(payload.service),
  ])
  if (!admin && !service) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found')
  }

  try {
    const meetingTopic = `Healthcare Consultation: ${payload?.firstName || payload.lastName} - ${service?.title || 'General Consultation'}`

    const adminLocalTimeISO = convertSessionTimeToLocalISO(
      result.scheduledAt,
      admin?.timezone!,
    )

    let zoomMeeting: any = null
    if (payload.paymentMethod === PAYMENT_METHOD.ONLINE) {
      zoomMeeting = await createZoomMeeting(
        meetingTopic,
        adminLocalTimeISO!,
        60,
        admin?.timezone,
      )

      await Bookings.findByIdAndUpdate(result._id, {
        link: zoomMeeting.joinUrl,
        meetingDetails: {
          meetingId: zoomMeeting.meetingId,
          password: zoomMeeting.password,
          joinUrl: zoomMeeting.joinUrl,
          startUrl: zoomMeeting.startUrl,
          meetingTime: zoomMeeting.meetingTime,
        },
      })
    }

    // Send booking confirmation email with Zoom details
    const userLocalTime = convertSessionTimeToLocal(
      result.scheduledAt,
      payload.timezone,
    )

    // Format date and time for email
    const bookingDate = new Date(userLocalTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const bookingTime = new Date(userLocalTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    // Send email to user
    const emailData = emailTemplate.bookingConfirmation({
      email: payload.email,
      name: `${payload.firstName} ${payload.lastName}`,
      date: bookingDate,
      time: bookingTime,
      service: service?.title || 'Healthcare Consultation',
      meetingLink: zoomMeeting?.joinUrl,
      meetingPassword: zoomMeeting?.password,
      meetingId: zoomMeeting?.meetingId,
    })

    emailHelper.sendEmail(emailData)
  } catch (error) {
    console.error('Failed to create Zoom meeting:', error)
  }

  // Send notification to admin with local time for the admin
  if (payload.user) {
    await sendNotification(
      payload.user as unknown as string,
      admin?._id as unknown as string,
      'New Booking Request',
      `Hello ${admin?.name}, you have a new meeting request at ${convertSessionTimeToLocal(result.scheduledAt, admin?.timezone!)}, please check your dashboard for more details.`,
    )
  }

  return result
}

const getAllBookings = async (user: JwtPayload) => {
  const [result, isUserExist] = await Promise.all([
    Bookings.find({}).populate('user', { name: 1, email: 1 }),
    User.findById(user.authId),
  ])
  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found')
  }

  //now convert the scheduledAt to local time
  result.forEach(booking => {
    booking.scheduledAt = new Date(
      convertSessionTimeToLocal(booking.scheduledAt, isUserExist.timezone),
    )
  })
  return result
}

const getUSerWiseBookings = async (user: JwtPayload) => {
  const isUserExist = await User.findById(user.authId)
  if (!isUserExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found')
  }

  const query = {
    $or: [{ user: isUserExist._id }, { email: isUserExist.email }],
  }

  const [result] = await Promise.all([
    Bookings.find(query).populate('user', { name: 1, email: 1 }),
  ])

  result.forEach(booking => {
    booking.scheduledAt = new Date(
      convertSessionTimeToLocal(booking.scheduledAt, isUserExist.timezone),
    )
  })

  return result
}

const getSingleBookings = async (user: JwtPayload, id: string) => {
  const [result, isUserExist] = await Promise.all([
    Bookings.findById(id).populate('user', { name: 1, email: 1 }),
    User.findById(user.authId),
  ])

  if (!isUserExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `You don't have permission to access this booking`,
    )
  }

  if (result) {
    result.scheduledAt = new Date(
      convertSessionTimeToLocal(result?.scheduledAt, isUserExist.timezone),
    )
  }
  return result
}

const updateBookings = async (
  user: JwtPayload,
  id: string,
  payload: Partial<IBookings & { date: string; time: string }>,
) => {
  const [isBookingExist, admin] = await Promise.all([
    Bookings.findById(id)
      .populate<{ user: { name: string; email: string } }>('user', {
        name: 1,
        email: 1,
      })
      .populate<{ service: { title: string; image: string } }>({
        path: 'service',
        select: { title: 1, image: 1 },
      }),
    User.findOne({ role: USER_ROLES.ADMIN }),
  ])

  if (!admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Admin not found')
  }
  if (!isBookingExist)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Booking not found')

  let notificationTitle = ''
  let notificationBody = ''

  if (payload.date && payload.time && user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Only admin can change the date and time of the scheduled time, please contact with admin.',
    )
  }

  //notification receiver local time for booking
  let userLocalTime = convertSessionTimeToLocal(
    isBookingExist.scheduledAt,
    isBookingExist.timezone,
  )

  if (payload.date && payload.time) {
    const convertedSlotToUtc = convertSessionTimeToUTC(
      payload.time,
      isBookingExist.timezone,
      payload.date,
    )
    const convertedScheduleDate = new Date(convertedSlotToUtc.isoString)

    const updatedBooking = await Bookings.findByIdAndUpdate(
      id,
      { $set: { scheduledAt: convertedScheduleDate } },
      {
        new: true,
      },
    )

    if (!updatedBooking) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update booking')
    }
    // Convert the scheduled time to the admin's local timezone
    const adminLocalTime = convertSessionTimeToLocal(
      updatedBooking.scheduledAt,
      admin?.timezone!,
    )

    const adminLocalTimeISO = convertSessionTimeToLocalISO(
      updatedBooking.scheduledAt,
      admin?.timezone!,
    )

    console.log(adminLocalTime, 'adminLocalTime')
    console.log(adminLocalTimeISO, 'adminLocalTimeISO')

    userLocalTime = convertSessionTimeToLocal(
      convertedScheduleDate,
      isBookingExist.timezone,
    )
    notificationTitle = 'Booking Date & Time Changed'
    notificationBody = `Booking date & time has been changed by ${isBookingExist.user}`

    if (isBookingExist.meetingDetails?.meetingId) {
      try {
        const meetingTopic = `Healthcare Consultation: ${isBookingExist.firstName || isBookingExist.lastName} - ${isBookingExist.service?.title || 'General Consultation'}`

        const adminLocalTimeISO = convertSessionTimeToLocalISO(
          updatedBooking.scheduledAt,
          admin?.timezone!,
        )

        // Create a new Zoom meeting with updated time
        const zoomMeeting = await createZoomMeeting(
          meetingTopic,
          adminLocalTimeISO!,
          60, // 60 minutes duration
          isBookingExist.timezone,
        )

        // Update the meeting details in the payload
        payload.link = zoomMeeting.joinUrl
        payload.meetingDetails = {
          meetingId: zoomMeeting.meetingId,
          password: zoomMeeting.password,
          joinUrl: zoomMeeting.joinUrl,
          startUrl: zoomMeeting.startUrl,
          meetingTime: zoomMeeting.meetingTime,
        }

        // Add meeting info to notification
        notificationBody += `. A new meeting link has been created. Please check your dashboard for the updated meeting details.`

        // Format date and time for email
        const bookingDate = new Date(userLocalTime).toLocaleDateString(
          'en-US',
          {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        )

        const bookingTime = new Date(userLocalTime).toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
          },
        )

        // Send rescheduling email to user
        const emailData = emailTemplate.bookingRescheduled({
          email: isBookingExist?.email || isBookingExist.email,
          name: `${isBookingExist.firstName} ${isBookingExist.lastName}`,
          date: bookingDate,
          time: bookingTime,
          service: isBookingExist.service?.title || 'Healthcare Consultation',
          meetingLink: zoomMeeting.joinUrl,
          meetingPassword: zoomMeeting.password,
          meetingId: zoomMeeting.meetingId,
        })

        emailHelper.sendEmail(emailData)
      } catch (error) {
        console.error('Failed to update Zoom meeting:', error)
        // Continue with booking update even if Zoom meeting update fails
      }
    }
    return updatedBooking
  }

  if (payload.link) {
    notificationTitle = `Meeting link is created by ${admin.name}`
    notificationBody = `Meeting link is created by ${admin.name}, please check your dashboard or email to get the meeting link and join at ${userLocalTime}`
  }

  if (
    payload.status === BOOKING_STATUS.ACCEPTED ||
    payload.status === BOOKING_STATUS.CANCELLED
  ) {
    notificationTitle = `Booking has been ${payload.status} by ${payload.status === BOOKING_STATUS.ACCEPTED ? admin.name : isBookingExist.user.name}`
    notificationBody = `Booking has been accepted by ${payload.status === BOOKING_STATUS.ACCEPTED ? admin.name : isBookingExist.user.name}`
  }
  if (
    payload.paymentRequired &&
    payload.paymentMethod === PAYMENT_METHOD.ONLINE
  ) {
    notificationTitle = `Payment is required for booking.`
    notificationBody = `Please pay the amount of ${isBookingExist.fee} for booking that is scheduled at ${userLocalTime}`
  }

  const result = await Bookings.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  )

  //send notification to user
  await sendNotification(
    admin?._id as unknown as string,
    isBookingExist?.user as unknown as string,
    notificationTitle,
    notificationBody,
  )
  return result
}

const deleteBookings = async (id: string) => {
  const result = await Bookings.findByIdAndDelete(id)
  return result
}

export const BookingsServices = {
  createBookings,
  getAllBookings,
  getSingleBookings,
  updateBookings,
  deleteBookings,
  getUSerWiseBookings,
}
