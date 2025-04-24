import { Request, Response } from 'express'

import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'
import { HealthcareconsultantService } from './healthcareconsultant.service'

const createHealthcareconsultant = catchAsync(
  async (req: Request, res: Response) => {
    const healthcareconsultantData = req.body
    const result = await HealthcareconsultantService.createHealthcareconsultant(
      healthcareconsultantData,
    )

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Healthcareconsultant created successfully',
      data: result,
    })
  },
)

const updateHealthcareconsultant = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const healthcareconsultantData = req.body
    const result = await HealthcareconsultantService.updateHealthcareconsultant(
      id,
      healthcareconsultantData,
    )

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Healthcareconsultant updated successfully',
      data: result,
    })
  },
)

const getSingleHealthcareconsultant = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const result =
      await HealthcareconsultantService.getSingleHealthcareconsultant(id)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Healthcareconsultant retrieved successfully',
      data: result,
    })
  },
)

const getAllHealthcareconsultants = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await HealthcareconsultantService.getAllHealthcareconsultants()

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Healthcareconsultants retrieved successfully',
      data: result,
    })
  },
)

const deleteHealthcareconsultant = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const result =
      await HealthcareconsultantService.deleteHealthcareconsultant(id)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Healthcareconsultant deleted successfully',
      data: result,
    })
  },
)

export const HealthcareconsultantController = {
  createHealthcareconsultant,
  updateHealthcareconsultant,
  getSingleHealthcareconsultant,
  getAllHealthcareconsultants,
  deleteHealthcareconsultant,
}
