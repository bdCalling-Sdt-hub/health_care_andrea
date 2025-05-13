import { Request, Response } from 'express'
import { BookingsServices } from './bookings.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'

const createBookings = catchAsync(async (req: Request, res: Response) => {
  const bookingsData = req.body
  const result = await BookingsServices.createBookings(req.user!, bookingsData)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Bookings created successfully',
    data: result,
  })
})

const updateBookings = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const bookingsData = req.body
  const result = await BookingsServices.updateBookings(
    req.user!,
    id,
    bookingsData,
  )

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookings updated successfully',
    data: result,
  })
})

const getSingleBookings = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await BookingsServices.getSingleBookings(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  })
})

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingsServices.getAllBookings(req.user!)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  })
})

const deleteBookings = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await BookingsServices.deleteBookings(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookings deleted successfully',
    data: result,
  })
})

const getUSerWiseBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingsServices.getUSerWiseBookings(req.user!)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  })
})

export const BookingsController = {
  createBookings,
  updateBookings,
  getSingleBookings,
  getAllBookings,
  deleteBookings,
  getUSerWiseBookings,
}
