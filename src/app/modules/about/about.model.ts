import { Schema, model } from 'mongoose'
import { IAbout, AboutModel } from './about.interface'

const descriptionsItemSchema = new Schema(
  {
    heading: { type: String },
    body: { type: String },
  },
  { _id: false },
)

const aboutSchema = new Schema<IAbout, AboutModel>(
  {
    title: { type: String },
    descriptions: [descriptionsItemSchema],
    images: { type: [String] },
    type: { type: String, enum: ['mission', 'vision', 'values'] },
  },
  {
    timestamps: true,
  },
)

export const About = model<IAbout, AboutModel>('About', aboutSchema)
