import { Schema, model } from 'mongoose'
import { ITabs, TabsModel } from './tabs.interface'

const contentsItemSchema = new Schema(
  {
    title: { type: String },
    descriptions: { type: [String] },
  },
  { _id: false },
)

const tabsSchema = new Schema<ITabs, TabsModel>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
    tabName: { type: String },
    contents: [contentsItemSchema],
    images: { type: [String] },
    videos: { type: [String] },
  },
  {
    timestamps: true,
  },
)

export const Tabs = model<ITabs, TabsModel>('Tabs', tabsSchema)
