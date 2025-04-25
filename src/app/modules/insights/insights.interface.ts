import { Model, Types } from 'mongoose'

export type IInsights = {
  _id: Types.ObjectId
  title: string
  description: string
  image: string
  sections: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export type InsightBars = {
  title: string
  body: string[]
}

export type ISections = {
  _id: Types.ObjectId
  insight: Types.ObjectId
  title: string
  image: string
  bars: InsightBars[]
  createdAt: Date
  updatedAt: Date
}

export type InsightsModel = Model<IInsights>
export type ISectionModel = Model<ISections>
