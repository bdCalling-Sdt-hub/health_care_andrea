import { Request, Response } from 'express'
import { AboutServices } from './about.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const createAbout = catchAsync(async (req: Request, res: Response) => {
  const { aboutData } = req.body

  const result = await AboutServices.manageAbout(aboutData)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'About created successfully',
    data: result,
  })
})

const updateAbout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const aboutData = req.body
  const result = await AboutServices.updateAbout(id, aboutData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'About updated successfully',
    data: result,
  })
})

const getSingleAbout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await AboutServices.getSingleAbout(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'About retrieved successfully',
    data: result,
  })
})

const getAllAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await AboutServices.getAllAbouts()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Abouts retrieved successfully',
    data: result,
  })
})

const deleteAbout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await AboutServices.deleteAbout(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'About deleted successfully',
    data: result,
  })
})

export const AboutController = {
  createAbout,
  updateAbout,
  getSingleAbout,
  getAllAbout,
  deleteAbout,
}
