import { Model, Types } from 'mongoose'

export type IReview = {
  _id: Types.ObjectId
  name: string
  image: string
  industry: string
  title: string
  review: string
  rating: number
}

export type ReviewModel = Model<IReview>
