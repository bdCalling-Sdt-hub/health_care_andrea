import { StatusCodes } from 'http-status-codes'
import { ILoginData } from '../../../interfaces/auth'
import ApiError from '../../../errors/ApiError'
import { USER_STATUS } from '../../../enum/user'
import { User } from '../user/user.model'
import { AuthHelper } from './auth.helper'

const handleLoginLogic = async (payload: ILoginData, isUserExist: any) => {
  const { authentication, verified, status } = isUserExist
  const password = isUserExist.password.trim()

  const { restrictionLeftAt, wrongLoginAttempts } = authentication

  if (!verified) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Your email is not verified, please verify your email and try again.',
    )
  }

  if (status === USER_STATUS.DELETED) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'No account found with this email',
    )
  }

  if (status === USER_STATUS.RESTRICTED) {
    if (restrictionLeftAt && new Date() < restrictionLeftAt) {
      const remainingMinutes = Math.ceil(
        (restrictionLeftAt.getTime() - Date.now()) / 60000,
      )
      throw new ApiError(
        StatusCodes.TOO_MANY_REQUESTS,
        `You are restricted to login for ${remainingMinutes} minutes`,
      )
    }

    // Handle restriction expiration
    await User.findByIdAndUpdate(isUserExist._id, {
      $set: {
        authentication: { restrictionLeftAt: null, wrongLoginAttempts: 0 },
        status: USER_STATUS.ACTIVE,
      },
    })
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    password,
  )

  if (!isPasswordMatched) {
    isUserExist.authentication.wrongLoginAttempts = wrongLoginAttempts + 1

    if (isUserExist.authentication.wrongLoginAttempts >= 5) {
      isUserExist.status = USER_STATUS.RESTRICTED
      isUserExist.authentication.restrictionLeftAt = new Date(
        Date.now() + 10 * 60 * 1000,
      ) // restriction for 10 minutes
    }

    await User.findByIdAndUpdate(isUserExist._id, {
      $set: {
        status: isUserExist.status,
        authentication: {
          restrictionLeftAt: isUserExist.authentication.restrictionLeftAt,
          wrongLoginAttempts: isUserExist.authentication.wrongLoginAttempts,
        },
      },
    })

    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Incorrect password, please try again.',
    )
  }

  await User.findByIdAndUpdate(
    isUserExist._id,
    {
      $set: {
        deviceToken: payload.deviceToken,
      },
    },
    { new: true },
  )

  const tokens = AuthHelper.createToken(isUserExist._id, isUserExist.role)

  await User.findByIdAndUpdate(
    isUserExist._id,
    {
      $set: {
        authentication: {
          restrictionLeftAt: null,
          wrongLoginAttempts: 0,
        },
      },
    },
    { new: true },
  )
  return tokens
}

export const AuthCommonServices = {
  handleLoginLogic,
}
