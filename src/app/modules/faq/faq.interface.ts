import { Model, Types } from 'mongoose'

export type IFaq = {
  question: string
  answer: string
  createdAt: Date
  updatedAt: Date
}

export type FaqModel = Model<IFaq>
