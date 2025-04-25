import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IPublic } from './public.interface'
import { Public } from './public.model'

const createPublic = async (payload: IPublic) => {
  const isExist = await Public.findOne({
    type: payload.type,
  })
  if (isExist) {
    await Public.findByIdAndUpdate(
      isExist._id,
      {
        $set: {
          content: payload.content,
        },
      },
      {
        new: true,
      },
    )
  } else {
    const result = await Public.create(payload)
    if (!result)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Public')
  }

  return 'Public created successfully'
}

const getAllPublics = async (
  type: 'privacy-policy' | 'terms-and-condition',
) => {
  const result = await Public.findOne({ type: type }).lean()
  return result
}

const deletePublic = async (id: string) => {
  const result = await Public.findByIdAndDelete(id)
  return result
}

export const PublicServices = {
  createPublic,
  getAllPublics,
  deletePublic,
}
