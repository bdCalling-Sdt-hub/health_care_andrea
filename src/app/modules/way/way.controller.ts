import { Request, Response, NextFunction } from 'express'
import { WayServices } from './way.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'
const createWay = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WayServices.createWay(req.body)
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Way created successfully',
      data: result,
    })
  },
)

const updateWay = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WayServices.updateWay(req.params.id, req.body)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Way updated successfully',
      data: result,
    })
  },
)
const getAllWays = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WayServices.getAllWays()
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Ways retrieved successfully',
      data: result,
    })
  },
)
const getSingleWay = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WayServices.getWay(req.params.id)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Way retrieved successfully',
      data: result,
    })
  },
)

const deleteWay = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WayServices.deleteWay(req.params.id)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Way deleted successfully',
      data: result,
    })
  },
)
export const WayController = {
  createWay,
  updateWay,
  getAllWays,
  getSingleWay,
  deleteWay,
}
