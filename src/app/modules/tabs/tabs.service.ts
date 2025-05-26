import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { ITabs } from './tabs.interface'

import { Tabs } from './tabs.model'
import { Types } from 'mongoose'
import { removeUploadedFiles } from '../../../utils/deleteUploadedFile'

const createTab = async (payload: ITabs): Promise<ITabs> => {
  const result = await Tabs.create(payload)
  if (!result) {
    if (payload.images.length > 0) {
      removeUploadedFiles(payload.images)
    }
    if (payload.videos.length > 0) {
      removeUploadedFiles(payload.videos)
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Tab')
  }
  return result
}

const updateTab = async (
  id: string,
  payload: Partial<ITabs>,
): Promise<ITabs | null> => {
  const result = await Tabs.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
    },
  )

  if (!result) {
    if (payload.images && payload?.images?.length > 0) {
      removeUploadedFiles(payload.images)
    }
    if (payload.videos && payload?.videos?.length > 0) {
      removeUploadedFiles(payload.videos)
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update Tab')
  }
  return result
}

const deleteTab = async (id: string): Promise<ITabs | null> => {
  const result = await Tabs.findByIdAndDelete(new Types.ObjectId(id))
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete Tab')
  }
  return result
}

const getSingleTab = async (id: string): Promise<ITabs | null> => {
  const result = await Tabs.findById(new Types.ObjectId(id))
  return result
}

const getAllTabs = async (id: Types.ObjectId): Promise<ITabs[]> => {
  const result = await Tabs.find({ service: id })
    .populate('service', 'title')
    .lean() // populate service inf
  return result
}

const getAllTabsForSearch = async (): Promise<ITabs[]> => {
  const result = await Tabs.find({}).lean()
  return result
}

export const TabsServices = {
  createTab,
  updateTab,
  deleteTab,
  getSingleTab,
  getAllTabs,
  getAllTabsForSearch,
}
