import { Schema, model } from 'mongoose'
import { IChallenges, ChallengesModel } from './challenges.interface'

const contentsItemSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    details: { type: [String] },
  },
  { _id: false },
)

const challengesSchema = new Schema<IChallenges, ChallengesModel>(
  {
    title: { type: String },
    description: { type: String },
    background: { type: String },
    images: { type: [String] },
    contents: [contentsItemSchema],
  },
  {
    timestamps: true,
  },
)

export const Challenges = model<IChallenges, ChallengesModel>(
  'Challenges',
  challengesSchema,
)
