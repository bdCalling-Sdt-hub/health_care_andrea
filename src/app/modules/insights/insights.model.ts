import { Schema, model } from 'mongoose'
import {
  IInsights,
  ISectionModel,
  ISections,
  InsightBars,
  InsightBarsModel,
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

const sectionSchema = new Schema<ISections, ISectionModel>(
  {
    insight: {
      type: Schema.Types.ObjectId,
      ref: 'Insights',
    }, // Reference to the Insight
    title: { type: String },
    image: { type: String },
    bars: [{ type: Schema.Types.ObjectId, ref: 'InsightBars' }],
  },
  { timestamps: true },
)

const insightBarsSchema = new Schema<InsightBars, InsightBarsModel>(
  {
    section: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
    }, // Reference to the Section
    title: { type: String },
    body: [{ type: String }],
  },
  { timestamps: true },
)

export const Insights = model<IInsights, InsightsModel>(
  'Insights',
  insightsSchema,
)

export const Section = model<ISections, ISectionModel>('Section', sectionSchema)
export const Bars = model<InsightBars, InsightBarsModel>(
  'InsightBars',
  insightBarsSchema,
)
