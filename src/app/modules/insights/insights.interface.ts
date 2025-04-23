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

export type ISections = {
  _id: Types.ObjectId
  insight: Types.ObjectId
  title: string
  image: string
  bars: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export type InsightBars = {
  _id: Types.ObjectId
  section: Types.ObjectId
  title: string
  body: string[]
  createdAt: Date
  updatedAt: Date
}

export type InsightsModel = Model<IInsights>
export type ISectionModel = Model<ISections>
export type InsightBarsModel = Model<InsightBars>
