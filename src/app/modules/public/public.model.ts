import { Schema, model } from 'mongoose'
import {
  IPublic,
  IPublicInformation,
  PublicInformationModel,
  PublicModel,
} from './public.interface'

const publicSchema = new Schema<IPublic, PublicModel>(
  {
    content: { type: String },
    type: { type: String, enum: ['privacy-policy', 'terms-and-condition'] },
  },
  {
    timestamps: true,
  },
)

export const Public = model<IPublic, PublicModel>('Public', publicSchema)

const PublicInformationSchema = new Schema<IPublicInformation>(
  {
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    x: {
      type: String,
    },
    youtube: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    footerDescription: {
      type: String,
      required: true,
    },
    businessStartDay: {
      type: String,
      required: true,
    },
    businessEndDay: {
      type: String,
      required: true,
    },
    businessStartTime: {
      type: String,
      required: true,
    },
    businessEndTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const PublicInformation = model<
  IPublicInformation,
  PublicInformationModel
>('PublicInformation', PublicInformationSchema)
