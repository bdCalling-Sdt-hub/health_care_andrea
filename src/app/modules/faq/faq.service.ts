import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IFaq } from './faq.interface'
import { Faq } from './faq.model'

const createFaq = async (payload: IFaq) => {
  const result = await Faq.create(payload)
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Faq')
  return result
}

const getAllFaqs = async () => {
  const result = await Faq.find()
  return result
}

const getSingleFaq = async (id: string) => {
  const result = await Faq.findById(id)
  return result
}

const updateFaq = async (id: string, payload: Partial<IFaq>) => {
  const result = await Faq.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  )
  return result
}

const deleteFaq = async (id: string) => {
  const result = await Faq.findByIdAndDelete(id)
  return result
}

export const FaqServices = {
  createFaq,
  getAllFaqs,
  getSingleFaq,
  updateFaq,
  deleteFaq,
}
