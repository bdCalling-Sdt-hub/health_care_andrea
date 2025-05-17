import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IContact, IPublic, IPublicInformation } from './public.interface'
import { Public, PublicInformation } from './public.model'

import { User } from '../user/user.model'
import { emailHelper } from '../../../helpers/emailHelper'
import config from '../../../config'

const createPublic = async (payload: IPublic) => {
  const isExist = await Public.findOne({
    type: payload.type,
  })
  if (isExist) {
    await Public.findByIdAndUpdate(
      isExist._id,
      {
        $set: {
          content: payload.content,
        },
      },
      {
        new: true,
      },
    )
  } else {
    const result = await Public.create(payload)
    if (!result)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Public')
  }

  return `${payload.type} created successfully}`
}

const getAllPublics = async (
  type: 'privacy-policy' | 'terms-and-condition',
) => {
  const result = await Public.findOne({ type: type }).lean()
  return result
}

const deletePublic = async (id: string) => {
  const result = await Public.findByIdAndDelete(id)
  return result
}

const createContact = async (payload: IContact) => {
  try {
    // Find admin user to send notification
    const admin = await User.findOne({ role: 'admin' })

    if (!admin || !admin.email) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Admin user not found',
      )
    }

    // Send email notification to admin
    const emailData = {
      to: admin.email,
      subject: 'New Contact Form Submission',
      html: `
        <h1>New Contact Form Submission</h1>
        <p>You have received a new message from the contact form:</p>
        <ul>
          <li><strong>Name:</strong> ${payload.name}</li>
          <li><strong>Email:</strong> ${payload.email}</li>
          <li><strong>Phone:</strong> ${payload.phone}</li>
          <li><strong>Country:</strong> ${payload.country}</li>
        </ul>
        <h2>Message:</h2>
        <p>${payload.message}</p>
        <p>You can respond directly to the sender by replying to: ${payload.email}</p>
      `,
    }

    emailHelper.sendEmail(emailData)

    // Send confirmation email to the user
    const userEmailData = {
      to: payload.email,
      subject: 'Thank you for contacting us',
      html: `
        <h1>Thank You for Contacting Us</h1>
        <p>Dear ${payload.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Here's a copy of your message:</p>
        <p><em>${payload.message}</em></p>
        <p>Best regards,<br>The Healthcare and Financial Consultants Team</p>
      `,
    }

    emailHelper.sendEmail(userEmailData)

    return {
      message: 'Contact form submitted successfully',
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to submit contact form',
    )
  }
}

const createOrUpdatePublicInformation = async (payload: IPublicInformation) => {
  try {
    const isExist = await PublicInformation.findOne({})

    if (isExist) {
      console.log(payload)

      const result = await PublicInformation.findByIdAndUpdate(
        isExist._id,
        { $set: { ...payload } },
        { new: true },
      )
      return result
    } else {
      const result = await PublicInformation.create(payload)
      if (!result) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Failed to create public information',
        )
      }
      return result
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create or update public information',
    )
  }
}

const getPublicInformation = async () => {
  try {
    const result = await PublicInformation.findOne({}).lean()

    return result
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to fetch public information',
    )
  }
}

export const PublicServices = {
  createPublic,
  getAllPublics,
  deletePublic,
  createContact,
  createOrUpdatePublicInformation,
  getPublicInformation,
}
