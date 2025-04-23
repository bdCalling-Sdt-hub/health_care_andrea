import { Request, Response, NextFunction } from 'express'
import { TabsServices } from './tabs.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

const createTab = catchAsync(async (req: Request, res: Response) => {
  const { image, media, ...tabData } = req.body
  if (image?.length > 0) {
    tabData.images = image
  }
  if (media?.length > 0) {
    tabData.videos = media
  }
  const result = await TabsServices.createTab(tabData)
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Tab created successfully',
    data: result,
  })
})

const updateTab = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { image, media, ...tabData } = req.body
  if (image?.length > 0) {
    tabData.images = image
  }
  if (media?.length > 0) {
    tabData.videos = media
  }
  const result = await TabsServices.updateTab(id, tabData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tab updated successfully',
    data: result,
  })
})
const getSingleTab = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await TabsServices.getSingleTab(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tab retrieved successfully',
    data: result,
  })
})
const getAllTabs = catchAsync(async (req: Request, res: Response) => {
  const result = await TabsServices.getAllTabs(
    new Types.ObjectId(req.params.id),
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tabs retrieved successfully',
    data: result,
  })
})
const deleteTab = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await TabsServices.deleteTab(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tab deleted successfully',
    data: result,
  })
})

export const TabsController = {
  createTab,
  updateTab,
  getSingleTab,
  getAllTabs,
  deleteTab,
}
