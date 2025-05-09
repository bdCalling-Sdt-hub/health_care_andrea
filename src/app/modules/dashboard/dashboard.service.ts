import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { Bookings } from '../bookings/bookings.model'
import { User } from '../user/user.model'
import { BOOKING_STATUS } from '../../../enum/booking'
import mongoose from 'mongoose'
import { USER_ROLES } from '../../../enum/user'
import { Chart } from './dashboard.interface'

// General statistics
const getGeneralStatistics = async () => {
  try {
    // Calculate total revenue from bookings
    const totalRevenue = await Bookings.aggregate([
      {
        $match: {
          fee: { $exists: true, $ne: null },
          status: BOOKING_STATUS.COMPLETED,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$fee' },
        },
      },
    ])

    // Count total clients (users)
    const totalClients = await User.countDocuments({
      role: USER_ROLES.USER,
    })

    // Count pending applications
    const pendingApplications = await Bookings.countDocuments({
      status: BOOKING_STATUS.PENDING,
    })

    // Count completed consultations
    const completedConsultations = await Bookings.countDocuments({
      status: BOOKING_STATUS.COMPLETED,
    })

    return {
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalClients,
      pendingApplications,
      completedConsultations,
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to fetch general statistics',
    )
  }
}

// Service analytics
const getServiceAnalytics = async () => {
  try {
    // Get total bookings count
    const totalBookings = await Bookings.countDocuments()

    if (totalBookings === 0) {
      return []
    }

    // Group bookings by service and calculate percentage
    const serviceAnalytics = await Bookings.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceDetails',
        },
      },
      {
        $unwind: {
          path: '$serviceDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          serviceName: '$serviceDetails.title',
          count: 1,
          percentage: {
            $multiply: [{ $divide: ['$count', totalBookings] }, 100],
          },
        },
      },
      {
        $sort: { percentage: -1 },
      },
    ])

    return serviceAnalytics
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to fetch service analytics',
    )
  }
}

// Booking statistics
const getBookingStatistics = async () => {
  try {
    // Get total bookings count
    const totalBookings = await Bookings.countDocuments()

    if (totalBookings === 0) {
      return {
        pendingRate: 0,
        completedRate: 0,
        cancelledRate: 0,
        totalBookings: 0,
      }
    }

    // Count bookings by status
    const pendingBookings = await Bookings.countDocuments({
      status: BOOKING_STATUS.PENDING,
    })

    const completedBookings = await Bookings.countDocuments({
      status: BOOKING_STATUS.COMPLETED,
    })

    const cancelledBookings = await Bookings.countDocuments({
      status: BOOKING_STATUS.CANCELLED,
    })

    // Calculate rates
    return {
      pendingRate: (pendingBookings / totalBookings) * 100,
      completedRate: (completedBookings / totalBookings) * 100,
      cancelledRate: (cancelledBookings / totalBookings) * 100,
      totalBookings,
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to fetch booking statistics',
    )
  }
}

// Revenue calculation
const getRevenueCalculation = async () => {
  try {
    // Calculate monthly revenue for the current year
    const currentYear = new Date().getFullYear()

    const monthlyRevenue = await Bookings.aggregate([
      {
        $match: {
          fee: { $exists: true, $ne: null },
          status: BOOKING_STATUS.COMPLETED,
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$fee' },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          month: '$_id',
          revenue: 1,
          _id: 0,
        },
      },
    ])

    // Fill in missing months with zero revenue
    const completeMonthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const existingMonth = monthlyRevenue.find(item => item.month === i + 1)
      return {
        month: i + 1,
        revenue: existingMonth ? existingMonth.revenue : 0,
      }
    })

    // Calculate total revenue
    const totalRevenue = completeMonthlyRevenue.reduce(
      (sum, month) => sum + month.revenue,
      0,
    )

    return {
      monthlyRevenue: completeMonthlyRevenue,
      totalRevenue,
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to fetch revenue calculation',
    )
  }
}

const createOrChartData = async (data: any[]) => {
  const isExist = await Chart.findOne({})
  if (isExist) {
    const result = Chart.updateOne(
      { _id: isExist._id },
      { $set: { data: data } },
    )
    return result
  }
  const result = Chart.create({ data: data })

  return result
}

const getChartData = async () => {
  const result = await Chart.find({}).lean()

  //now get best services based on booking for services
  return result
}

export const DashboardServices = {
  getGeneralStatistics,
  getServiceAnalytics,
  getBookingStatistics,
  getRevenueCalculation,
  createOrChartData,
  getChartData,
}
