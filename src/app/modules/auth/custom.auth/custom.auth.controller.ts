import { Request, Response } from 'express'
import catchAsync from '../../../../shared/catchAsync'
import { CustomAuthServices } from './custom.auth.service'
import sendResponse from '../../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const customLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body

  const result = await CustomAuthServices.customLogin(loginData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, phone } = req.body
  const result = await CustomAuthServices.forgetPassword(email, phone)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `An OTP has been sent to your ${email || phone}. Please verify your email.`,
    data: result,
  })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization
  const { ...resetData } = req.body
  const result = await CustomAuthServices.resetPassword(token!, resetData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset successfully, please login now.',
    data: result,
  })
})

const verifyAccount = catchAsync(async (req: Request, res: Response) => {
  const { oneTimeCode, phone, email } = req.body
  const result = await CustomAuthServices.verifyAccount(
    oneTimeCode,
    email,
    phone,
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Account verified successfully, please login now.',
    data: result,
  })
})

const getRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  const result = await CustomAuthServices.getRefreshToken(refreshToken)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  })
})

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, phone } = req.body
  const result = await CustomAuthServices.resendOtp(email, phone)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `An OTP has been sent to your ${email || phone}. Please verify your email.`,
  })
})

export const CustomAuthController = {
  forgetPassword,
  resetPassword,
  verifyAccount,
  customLogin,
  getRefreshToken,
  resendOtp,
}
