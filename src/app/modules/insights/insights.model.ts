import { Schema, model } from 'mongoose'
import {
  IInsights,
  ISectionModel,
  ISections,
  InsightBars,
  InsightsModel,
} from './insights.interface'

const insightsSchema = new Schema<IInsights, InsightsModel>(
  {
    title: { type: String },
    description: { type: String },
    image: { type: String },
    sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  },
  {
    timestamps: true,
  },
)

const insightBarsSchema = new Schema<InsightBars>(
  {
    title: { type: String },
    body: [{ type: String }],
  },
  { _id: false },
)

const sectionSchema = new Schema<ISections, ISectionModel>(
  {
    insight: {
      type: Schema.Types.ObjectId,
      ref: 'Insights',
    }, // Reference to the Insight
    title: { type: String },
    image: { type: String },
    bars: [insightBarsSchema],
  },
  { timestamps: true },
)

export const Insights = model<IInsights, InsightsModel>(
  'Insights',
  insightsSchema,
)

export const Section = model<ISections, ISectionModel>('Section', sectionSchema)
