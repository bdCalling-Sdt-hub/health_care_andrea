import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IWay } from './way.interface'
import { Way } from './way.model'

const createWay = async (wayData: IWay): Promise<IWay> => {
  const result = await Way.create(wayData)
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create way')
  }
  return result
}
const getWay = async (id: string): Promise<IWay | null> => {
  const result = await Way.findById(id)
  return result
}

const getAllWays = async (): Promise<IWay[]> => {
  const result = await Way.find()
  return result
}
const updateWay = async (
  id: string,
  payload: Partial<IWay>,
): Promise<IWay | null> => {
  const isExist = await Way.findById(id)
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Way not found')
  }
  const result = await Way.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    {
      new: true,
    },
  )
  return result
}

const deleteWay = async (id: string): Promise<IWay | null> => {
  const result = await Way.findByIdAndDelete(id)
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete way')
  return result
}

export const WayServices = {
  createWay,
  updateWay,
  deleteWay,
  getWay,
  getAllWays,
}
