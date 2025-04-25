import { Schema, model } from 'mongoose'
import { IFaq, FaqModel } from './faq.interface'

const faqSchema = new Schema<IFaq, FaqModel>(
  {
    question: { type: String },
    answer: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  },
)

export const Faq = model<IFaq, FaqModel>('Faq', faqSchema)
