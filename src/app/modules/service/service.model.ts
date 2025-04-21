import { Schema, model } from 'mongoose'
import { IService, ServiceModel } from './service.interface'

const serviceSchema = new Schema<IService, ServiceModel>(
  {
    image: { type: String },
    title: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  },
)

export const Service = model<IService, ServiceModel>('Service', serviceSchema)
