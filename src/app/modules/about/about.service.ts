import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IAbout } from './about.interface'
import { About } from './about.model'

const manageAbout = async (payload: IAbout) => {
  const isExist = await About.findOne({
    type: payload.type,
  })
  if (isExist) {
    const result = await About.findOneAndUpdate(
      { type: payload.type },
      { $set: payload },
      {
        new: true,
      },
    )
    return result
  } else {
    const result = await About.create(payload)
    if (!result)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create About')
    return result
  }
}

const getAllAbouts = async () => {
  const result = await About.find()
  return result
}

const getSingleAbout = async (id: string) => {
  const result = await About.findById(id)
  return result
}

const updateAbout = async (id: string, payload: Partial<IAbout>) => {
  const result = await About.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  )
  return result
}

const deleteAbout = async (id: string) => {
  const result = await About.findByIdAndDelete(id)
  return result
}

export const AboutServices = {
  manageAbout,
  getAllAbouts,
  getSingleAbout,
  updateAbout,
  deleteAbout,
}
