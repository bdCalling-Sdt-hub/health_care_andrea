import { StatusCodes } from 'http-status-codes'
import { IInsights, ISections, InsightBars } from './insights.interface'

import { Bars, Insights, Section } from './insights.model'
import ApiError from '../../../errors/ApiError'
import { Types } from 'mongoose'

const createInsights = async (payload: IInsights): Promise<IInsights> => {
  const result = await Insights.create(payload)
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create insights')
  return result
}
const updateInsights = async (
  id: string,
  payload: Partial<IInsights>,
): Promise<IInsights | null> => {
  console.log(payload)
  const result = await Insights.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    { new: true },
  )
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update insights')
  return result
}

const getSingleInsights = async (id: string): Promise<IInsights | null> => {
  const result = await Insights.findById(new Types.ObjectId(id)).populate({
    path: 'sections',
    populate: {
      path: 'bars',
      model: 'Bars',
    },
  })

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get insights')
  }
  return result
}
const getAllInsights = async (): Promise<IInsights[]> => {
  const result = await Insights.find().populate({
    path: 'sections',
    select: {
      title: 1,
      image: 1,
      bars: 1,
    },
    populate: {
      path: 'bars',
      model: 'InsightBars',
    },
  })
  return result
}
const deleteInsights = async (id: string): Promise<IInsights | null> => {
  const session = await Section.startSession()
  try {
    session.startTransaction()
    const result = await Insights.findByIdAndDelete(new Types.ObjectId(id))

    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete insights')
    }

    const sectionIds = result.sections.map(section => section.toString())

    await Promise.all([
      Section.deleteMany({ _id: { $in: result.sections } }),
      Bars.deleteMany({ _id: { $in: sectionIds } }),
    ])
    await session.commitTransaction()
    return result
  } catch (error) {
    await session.abortTransaction()
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete insights')
  } finally {
    await session.endSession()
  }
}

const createInsightSection = async (
  id: string,
  payload: Partial<ISections>,
): Promise<ISections | null> => {
  const session = await Section.startSession()
  try {
    session.startTransaction()

    payload.insight = new Types.ObjectId(id)

    const result = await Section.create({ ...payload, session })
    if (!result || !result._id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create section')
    }

    const updateResult = await Insights.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $push: { sections: result._id } },
      { new: true, session },
    )

    if (!updateResult) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to update insights with new section',
      )
    }

    await session.commitTransaction()

    return result
  } catch (error) {
    await session.abortTransaction()
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create section')
  } finally {
    await session.endSession()
  }
}

const updateInsightSection = async (
  id: string,
  payload: Partial<IInsights>,
): Promise<ISections | null> => {
  console.log(payload, id)
  const result = await Section.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    { new: true },
  )
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update section')
  return result
}

const getAllSectionsByInsightsId = async (
  id: string,
): Promise<ISections[] | null> => {
  const insightExist = await Insights.findById(new Types.ObjectId(id))
  if (!insightExist)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insight not found')
  const result = await Section.find({ _id: { $in: insightExist.sections } })
    .populate({
      path: 'insight',
      select: 'title description image',
      model: 'Insights',
    })
    .populate({
      path: 'bars',
      model: 'InsightBars',
    })
    .lean()

  return result
}

const getSingleSectionByInsightsId = async (
  id: string,
): Promise<ISections | null> => {
  const result = await Section.findById(new Types.ObjectId(id))
  return result
}

const deleteInsightSection = async (
  id: string,
): Promise<ISections | null | string> => {
  const session = await Section.startSession()
  try {
    session.startTransaction()
    const result = await Section.findByIdAndDelete(new Types.ObjectId(id), {
      session,
    })
    if (!result)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete section')
    // Update the insights collection to remove the section's _id
    const [updateResult, deleteBars] = await Promise.all([
      Insights.updateOne(
        { _id: result.insight },
        { $pull: { sections: result._id } },
        { session },
      ),
      Bars.deleteMany({ section: result._id }, { session }),
    ])
    if (!updateResult || !deleteBars) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete section')
    }
    //also delete all bars
    await session.commitTransaction()
    return 'Section removed successfully.'
  } catch (error) {
    await session.abortTransaction()
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete section')
  } finally {
    await session.endSession()
  }
}

const createSectionBar = async (
  id: string,
  payload: Partial<InsightBars>,
): Promise<InsightBars | null> => {
  const session = await Section.startSession()
  try {
    session.startTransaction()
    payload.section = new Types.ObjectId(id)
    const result = await Bars.create({ ...payload, session })
    if (!result || !result._id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create section')
    }
    const updateResult = await Section.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $push: { bars: result._id } },
      { new: true, session },
    )

    if (!updateResult) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to update insights with new section',
      )
    }
    await session.commitTransaction()
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create section')
  } finally {
    await session.endSession()
  }
}

const updateSectionBar = async (
  id: string,
  payload: Partial<InsightBars>,
): Promise<InsightBars | null> => {
  const result = await Bars.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    { new: true },
  )
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update section')
  return result
}

const getAllBarsBySectionId = async (
  id: string,
): Promise<InsightBars[] | null> => {
  const result = await Bars.find({ section: new Types.ObjectId(id) })
  return result
}
const deleteSectionBar = async (id: string): Promise<InsightBars | null> => {
  const result = await Bars.findByIdAndDelete(new Types.ObjectId(id))
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete section')
  return result
}

export const InsightsServices = {
  createInsights,
  updateInsights,
  getSingleInsights,
  getAllInsights,
  deleteInsights,

  //section
  createInsightSection,
  updateInsightSection,
  getSingleSectionByInsightsId,
  getAllSectionsByInsightsId,
  deleteInsightSection,

  //bar
  createSectionBar,
  updateSectionBar,
  getAllBarsBySectionId,
  deleteSectionBar,
}
