import { Request, Response, NextFunction } from 'express'

import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './user.interface'
import { UserServices } from './user.service'

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body
  const user = await UserServices.createUser(userData)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User created successfully',
    data: user,
  })
})

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { image, ...userData } = req.body

  userData.profile = image[0]
  const result = await UserServices.updateProfile(req.user!, userData)
  sendResponse<String>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  })
})
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getUserProfile(req.user!)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  })
})

const manageSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.manageSchedule(req.user!, req.body)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Schedule updated successfully',
    data: result,
  })
})

const getSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getSchedule(req.user!)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Schedule retrieved successfully',
    data: result,
  })
})

const getAvailableTime = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAvailableTime(
    req.user!,
    req.params.date as string,
    req.query.timezone as string,
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Available slot retrieved successfully',
    data: result,
  })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getALlUsers()
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  })
})

export const UserController = {
  createUser,
  updateProfile,
  getProfile,
  manageSchedule,
  getSchedule,
  getAvailableTime,
  getAllUsers,
}
