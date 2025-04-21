import { Schema, model } from 'mongoose'
import { IWay, WayModel } from './way.interface'

const contentsItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  { _id: false },
)

const waySchema = new Schema<IWay, WayModel>(
  {
    title: { type: String },
    description: { type: String },
    subDescription: { type: String },
    contents: { type: [contentsItemSchema] },
  },
  {
    timestamps: true,
  },
)

export const Way = model<IWay, WayModel>('Way', waySchema)
