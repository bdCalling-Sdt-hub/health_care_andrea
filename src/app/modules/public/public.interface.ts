import { Model, Types } from 'mongoose'

export type IPublic = {
  content: string
  type: string
}

export type PublicModel = Model<IPublic>
