import { Schema, model } from 'mongoose'
import {
  IHealthcareconsultant,
  HealthcareconsultantModel,
} from './healthcareconsultant.interface'

const contentsItemSchema = new Schema(
  {
    heading: { type: String },
    body: { type: String },
  },
  { _id: false },
)

const healthcareconsultantSchema = new Schema<
  IHealthcareconsultant,
  HealthcareconsultantModel
>(
  {
    label: {
      type: String,
      enum: ['DIE', 'CSO', 'PTR', 'ITI', 'CCA'],
      required: true,
    },
    title: { type: String },
    description: { type: String },
    contents: [contentsItemSchema],
    footer: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  },
)

export const Healthcareconsultant = model<
  IHealthcareconsultant,
  HealthcareconsultantModel
>('Healthcareconsultant', healthcareconsultantSchema)
