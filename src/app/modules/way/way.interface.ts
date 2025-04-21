import { Model, Types } from 'mongoose'

export interface ContentsItem {
  title: string
  description?: string
}

export type IWay = {
  _id: Types.ObjectId
  title: string
  description: string
  subDescription: string
  contents: ContentsItem[]
}

export type WayModel = Model<IWay>
