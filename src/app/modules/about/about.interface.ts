import { Model, Types } from 'mongoose'

export interface DescriptionsItem {
  heading: string
  body: string
}

export type IAbout = {
  _id: Types.ObjectId
  descriptions: DescriptionsItem[]
  images: string[]
  type: string
}

export type AboutModel = Model<IAbout>
