import { Model, Types } from 'mongoose'

export interface ContentsItem {
  heading: string
  body: string
}

export type IHealthcareconsultant = {
  _id: Types.ObjectId
  label: 'DIE' | 'CSO' | 'PTR' | 'ITI' | 'CCA'
  title: string
  description: string
  contents: ContentsItem[]
  footer: string
  createdAt: Date
  updatedAt: Date
}

export type HealthcareconsultantModel = Model<IHealthcareconsultant>
