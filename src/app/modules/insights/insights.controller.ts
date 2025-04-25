import { Request, Response, NextFunction } from 'express'
import { InsightsServices } from './insights.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const createInsights = catchAsync(async (req: Request, res: Response) => {
  const { image, ...insightsData } = req.body
  if (image?.length > 0) {
    insightsData.image = image[0]
  }
  const result = await InsightsServices.createInsights(insightsData)
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Insights created successfully',
    data: result,
  })
})

const updateInsights = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const { image, ...insightsData } = req.body

  if (image?.length > 0) {
    insightsData.image = image[0]
  }

  const result = await InsightsServices.updateInsights(id, insightsData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights updated successfully',
    data: result,
  })
})

const deleteInsights = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await InsightsServices.deleteInsights(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights deleted successfully',
    data: result,
  })
})

const getSingleInsights = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await InsightsServices.getSingleInsights(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights retrieved successfully',
    data: result,
  })
})

const getAllInsights = catchAsync(async (req: Request, res: Response) => {
  const result = await InsightsServices.getAllInsights()
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights retrieved successfully',
    data: result,
  })
})

const createInsightSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { image, ...sectionData } = req.body
  if (image?.length > 0) {
    sectionData.image = image[0]
  }
  const result = await InsightsServices.createInsightSection(id, sectionData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights section created successfully',
    data: result,
  })
})

const updateInsightSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { image, ...sectionData } = req.body
  if (image?.length > 0) {
    sectionData.image = image[0]
  }
  const result = await InsightsServices.updateInsightSection(id, sectionData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights section updated successfully',
    data: result,
  })
})

const deleteInsightSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await InsightsServices.deleteInsightSection(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights section deleted successfully',
    data: result,
  })
})

const getInsightSections = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await InsightsServices.getAllSectionsByInsightsId(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights sections retrieved successfully',
    data: result,
  })
})

const createBar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(req.body.contents!)
  const result = await InsightsServices.createSectionBar(id, req.body.contents)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights bar created successfully',
    data: result,
  })
})

const updateBar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await InsightsServices.updateSectionBar(id, req.body)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Insights bar updated successfully',
    data: result,
  })
})

export const InsightsController = {
  createInsights,
  updateInsights,
  deleteInsights,
  getAllInsights,
  getSingleInsights,
  //section
  createInsightSection,
  updateInsightSection,
  deleteInsightSection,
  getInsightSections,

  //bar
  createBar,
  updateBar,
}
