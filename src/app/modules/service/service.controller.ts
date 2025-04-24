import { Request, Response, NextFunction } from 'express'
import { ServiceServices } from './service.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const createService = catchAsync(async (req: Request, res: Response) => {
  const { image, ...serviceData } = req.body
  if (image?.length > 0) {
    serviceData.image = image[0]
  }
  const result = await ServiceServices.createService(serviceData)
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Service created successfully',
    data: result,
  })
})

const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { image, ...serviceData } = req.body
  console.log(req.body)
  if (image?.length > 0) {
    serviceData.image = image[0]
  }
  const result = await ServiceServices.updateService(id, serviceData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  })
})

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ServiceServices.deleteService(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  })
})

const getService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ServiceServices.getService(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  })
})

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.getAllServices()
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Services retrieved successfully',
    data: result,
  })
})

export const ServiceController = {
  createService,
  updateService,
  deleteService,
  getService,
  getAllServices,
}
