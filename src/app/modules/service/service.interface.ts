import { Model, Types } from 'mongoose'

export type IService = {
  _id: Types.ObjectId
  image: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export type ServiceModel = Model<IService>
