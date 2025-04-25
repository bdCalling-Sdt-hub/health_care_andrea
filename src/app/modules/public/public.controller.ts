import { Request, Response } from 'express'
import { PublicServices } from './public.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const createPublic = catchAsync(async (req: Request, res: Response) => {
  const publicData = req.body
  const result = await PublicServices.createPublic(publicData)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Public created successfully',
    data: result,
  })
})

const getAllPublics = catchAsync(async (req: Request, res: Response) => {
  const result = await PublicServices.getAllPublics(
    req.params.type as 'privacy-policy' | 'terms-and-condition',
  )

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Publics retrieved successfully',
    data: result,
  })
})

const deletePublic = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await PublicServices.deletePublic(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Public deleted successfully',
    data: result,
  })
})

export const PublicController = {
  createPublic,
  getAllPublics,
  deletePublic,
}
