import { Request, Response } from 'express'
import { ReviewServices } from './review.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { image, ...reviewData } = req.body
  if (image?.length > 0) {
    reviewData.image = image[0]
  }
  const result = await ReviewServices.createReview(reviewData)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  })
})

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { image, ...reviewData } = req.body
  if (image?.length > 0) {
    reviewData.image = image[0]
  }
  const result = await ReviewServices.updateReview(id, reviewData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  })
})

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ReviewServices.getSingleReview(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  })
})

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getAllReviews()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  })
})

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ReviewServices.deleteReview(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  })
})

export const ReviewController = {
  createReview,
  updateReview,
  getSingleReview,
  getAllReviews,
  deleteReview,
}
