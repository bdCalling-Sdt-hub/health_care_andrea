import { Request, Response } from 'express'
import { ChallengesServices } from './challenges.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const createChallenges = catchAsync(async (req: Request, res: Response) => {
  const { image, ...challengesData } = req.body

  if (image?.length > 0) {
    challengesData.background = image[0]
    challengesData.images = image.slice(1)
  }

  const result = await ChallengesServices.createChallenges(challengesData)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Challenges created successfully',
    data: result,
  })
})

const updateChallenges = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { image, ...challengesData } = req.body
  if (image?.length > 0) {
    challengesData.background = image[0]
    challengesData.images = image.slice(1)
  }
  const result = await ChallengesServices.updateChallenges(id, challengesData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Challenges updated successfully',
    data: result,
  })
})

const getSingleChallenges = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ChallengesServices.getSingleChallenges(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Challenges retrieved successfully',
    data: result,
  })
})

const getAllChallenges = catchAsync(async (req: Request, res: Response) => {
  const result = await ChallengesServices.getAllChallenges()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Challenges retrieved successfully',
    data: result,
  })
})

const deleteChallenges = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ChallengesServices.deleteChallenges(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Challenges deleted successfully',
    data: result,
  })
})

export const ChallengesController = {
  createChallenges,
  updateChallenges,
  getSingleChallenges,
  getAllChallenges,
  deleteChallenges,
}
