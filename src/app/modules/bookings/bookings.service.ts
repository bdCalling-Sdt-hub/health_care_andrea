import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IBookings } from './bookings.interface'
import { Bookings } from './bookings.model'

const createBookings = async (payload: IBookings) => {
  console.log(payload)
  return payload
  // // const result = await Bookings.create(payload)
  // if (!result)
  //   throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Bookings')
  // return result
}

const getAllBookings = async () => {
  const result = await Bookings.find()
  return result
}

const getSingleBookings = async (id: string) => {
  const result = await Bookings.findById(id)
  return result
}

const updateBookings = async (id: string, payload: Partial<IBookings>) => {
  const result = await Bookings.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  )
  return result
}

const deleteBookings = async (id: string) => {
  const result = await Bookings.findByIdAndDelete(id)
  return result
}

export const BookingsServices = {
  createBookings,
  getAllBookings,
  getSingleBookings,
  updateBookings,
  deleteBookings,
}
