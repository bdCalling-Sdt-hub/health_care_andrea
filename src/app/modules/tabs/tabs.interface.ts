import { Model, Types } from 'mongoose'

export interface ContentsItem {
  title: string
  descriptions: string[]
}

export type ITabs = {
  service: Types.ObjectId // Referencing the Service model
  tabName: string
  contents: ContentsItem[]
  images: string[]
  videos: string[]
}

export type TabsModel = Model<ITabs>
