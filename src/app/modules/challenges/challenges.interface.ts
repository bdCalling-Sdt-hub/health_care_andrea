import { Model, Types } from 'mongoose'

export interface ContentsItem {
  title: string
  description?: string
  details?: string[]
}

export type IChallenges = {
  _id: Types.ObjectId
  title: string
  description: string
  background: string
  images: string[]
  contents: ContentsItem[]
  createdAt: Date
  updatedAt: Date
}

export type ChallengesModel = Model<IChallenges>
