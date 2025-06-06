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
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    description: { type: String },
    background: { type: String },
    images: { type: [String] },
    contents: [contentsItemSchema],
    footer: { type: String },
  },
  {
    timestamps: true,
  },
)

export const Challenges = model<IChallenges, ChallengesModel>(
  'Challenges',
  challengesSchema,
)
