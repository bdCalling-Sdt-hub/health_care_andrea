import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IService, ServiceModel } from './service.interface'
import { Service } from './service.model'
import { Types } from 'mongoose'
import fs from 'fs'
import { removeUploadedFiles } from '../../../utils/deleteUploadedFile'

const createService = async (payload: IService): Promise<IService> => {
  const result = Service.create(payload)
  if (!result) {
    removeUploadedFiles(payload.image)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create service')
  }

  return result
}

const updateService = async (
  id: string,
  payload: Partial<IService>,
): Promise<IService | null> => {
  const isExist = await Service.findById(new Types.ObjectId(id))
  if (!isExist) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  //   fs.unlinkSync(isExist.image)
  const result = await Service.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

const deleteService = async (id: string): Promise<IService | null> => {
  const result = await Service.findByIdAndDelete(new Types.ObjectId(id))
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete services.')
  return result
}

const getService = async (id: string): Promise<IService | null> => {
  const result = await Service.findById(new Types.ObjectId(id))
  if (!result)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Requested service not found.')
  return result
}

const getAllServices = async (): Promise<IService[]> => {
  const result = await Service.find()

  return result
}

export const ServiceServices = {
  createService,
  updateService,
  deleteService,
  getService,
  getAllServices,
}
