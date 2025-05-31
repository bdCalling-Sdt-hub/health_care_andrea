import { Model, Types } from 'mongoose'

export type IPublic = {
  content: string
  type: string
}

export interface IContact {
  name: string
  email: string
  phone: string
  country: string
  message: string
  createdAt?: Date
  updatedAt?: Date
}
export type PublicModel = Model<IPublic>

export interface IPageDescription {
  about: string
  contactus: string
  ourinsights: string
  ourway: string
  services: string
}

export type PageDescriptionModel = Model<IPageDescription>

export interface IPublicInformation {
  contact: string
  contactDescription: string
  email: string
  facebook: string
  instagram: string
  x: string
  youtube: string
  linkedin: string
  footerDescription: string
  businessStartDay: string
  businessEndDay: string
  businessStartTime: string
  businessEndTime: string
}

export type PublicInformationModel = Model<IPublicInformation>
