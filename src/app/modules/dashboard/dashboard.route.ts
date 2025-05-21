import express from 'express'
import { DashboardController } from './dashboard.controller'
import { USER_ROLES } from '../../../enum/user'
import auth from '../../middleware/auth'

const router = express.Router()

// Protect all dashboard routes with admin authentication
router.get(
  '/general-statistics',
  auth(USER_ROLES.ADMIN),
  DashboardController.getGeneralStatistics,
)

router.get(
  '/service-analytics',
  auth(USER_ROLES.ADMIN),
  DashboardController.getServiceAnalytics,
)

router.get(
  '/booking-statistics',
  auth(USER_ROLES.ADMIN),
  DashboardController.getBookingStatistics,
)

router.get(
  '/revenue-calculation',
  auth(USER_ROLES.ADMIN),
  DashboardController.getRevenueCalculation,
)

router.post(
  '/chart',
  auth(USER_ROLES.ADMIN),
  DashboardController.createOrUpdateChart,
)
router.get('/chart/', DashboardController.getChartData)

export const DashboardRoutes = router
