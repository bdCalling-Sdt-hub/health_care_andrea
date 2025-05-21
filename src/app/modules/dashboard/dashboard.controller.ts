import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'
import { DashboardServices } from './dashboard.service'

const getGeneralStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getGeneralStatistics()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'General statistics retrieved successfully',
    data: result,
  })
})

const getServiceAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getServiceAnalytics()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service analytics retrieved successfully',
    data: result,
  })
})

const getBookingStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getBookingStatistics()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking statistics retrieved successfully',
    data: result,
  })
})

const getRevenueCalculation = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DashboardServices.getRevenueCalculation()

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Revenue calculation retrieved successfully',
      data: result,
    })
  },
)

const createOrUpdateChart = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.createOrChartData(
    req.body,
    req.params.type,
  )

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chart created or updated successfully',
    data: result,
  })
})

const getChartData = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getChartData()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chart data retrieved successfully',
    data: result,
  })
})

export const DashboardController = {
  getGeneralStatistics,
  getServiceAnalytics,
  getBookingStatistics,
  getRevenueCalculation,
  createOrUpdateChart,
  getChartData,
}
