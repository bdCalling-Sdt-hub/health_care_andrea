import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IHealthcareconsultant } from './healthcareconsultant.interface'
import { Healthcareconsultant } from './healthcareconsultant.model'

const createHealthcareconsultant = async (payload: IHealthcareconsultant) => {
  const result = await Healthcareconsultant.create(payload)
  if (!result)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create healthcareconsultant',
    )
  return result
}
const getAllHealthcareconsultants = async () => {
  const result = await Healthcareconsultant.find()
  return result
}
const getSingleHealthcareconsultant = async (id: string) => {
  const result = await Healthcareconsultant.findById(id)
  return result
}
const updateHealthcareconsultant = async (
  id: string,
  payload: Partial<IHealthcareconsultant>,
) => {
  const result = await Healthcareconsultant.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  )
  return result
}
const deleteHealthcareconsultant = async (id: string) => {
  const result = await Healthcareconsultant.findByIdAndDelete(id)
  return result
}

export const HealthcareconsultantService = {
  createHealthcareconsultant,
  getAllHealthcareconsultants,
  getSingleHealthcareconsultant,
  updateHealthcareconsultant,
  deleteHealthcareconsultant,
}
