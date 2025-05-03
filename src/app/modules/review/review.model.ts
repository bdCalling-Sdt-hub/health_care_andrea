import { Schema, model } from 'mongoose'
import { IReview, ReviewModel } from './review.interface'

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    name: { type: String },
    image: { type: String },
    industry: { type: String },
    title: { type: String },
    review: { type: String },
    rating: { type: Number },
  },
  {
    timestamps: true,
  },
)

export const Review = model<IReview, ReviewModel>('Review', reviewSchema)
