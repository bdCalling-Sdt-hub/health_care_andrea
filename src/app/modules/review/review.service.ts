import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IReview } from './review.interface'
import { Review } from './review.model'
import { Types } from 'mongoose'

const createReview = async (payload: IReview) => {
  const result = await Review.create(payload)
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Review')
  return result
}

const getAllReviews = async () => {
  const result = await Review.find()
  return result
}

const getSingleReview = async (id: string) => {
  const result = await Review.findById(id)
  return result
}

const updateReview = async (id: string, payload: Partial<IReview>) => {
  const result = await Review.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
    },
  )
  return result
}

const deleteReview = async (id: string) => {
  const result = await Review.findByIdAndDelete(id)
  return result
}

export const ReviewServices = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
}
