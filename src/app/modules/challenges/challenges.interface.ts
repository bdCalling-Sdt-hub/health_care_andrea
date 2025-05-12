import { Model, Types } from 'mongoose'

export interface ContentsItem {
  title: string
  description?: string
  details?: string[]
}

export type IChallenges = {
  _id: Types.ObjectId
  title: string
  service: Types.ObjectId
  description: string
  background: string
  images: string[]
  footer: string
  contents: ContentsItem[]
  createdAt: Date
  updatedAt: Date
}

export type ChallengesModel = Model<IChallenges>
