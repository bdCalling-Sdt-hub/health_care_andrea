import { UserRoutes } from '../app/modules/user/user.route'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import express, { Router } from 'express'
import { ServiceRoutes } from '../app/modules/service/service.route'
import { WayRoutes } from '../app/modules/way/way.route'
import { TabsRoutes } from '../app/modules/tabs/tabs.route'
import { InsightsRoutes } from '../app/modules/insights/insights.route'
import { HealthcareconsultantRoutes } from '../app/modules/healthcareconsultant/healthcareconsultant.route'

import { ChallengesRoutes } from '../app/modules/challenges/challenges.route'
import { BookingsRoutes } from '../app/modules/bookings/bookings.route'
import { NotificationRoutes } from '../app/modules/notification/notification.route'
import { FaqRoutes } from '../app/modules/faq/faq.route'
import { PublicRoutes } from '../app/modules/public/public.route'
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route'
import { PaymentRoutes } from '../app/modules/payment/payment.route'
import { ReviewRoutes } from '../app/modules/review/review.route'
import { AboutRoutes } from '../app/modules/about/about.route'
import { fileRoutes } from '../app/modules/file/file.route'

const router = express.Router()

const apiRoutes: { path: string; route: Router }[] = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/service', route: ServiceRoutes },
  { path: '/way', route: WayRoutes },
  { path: '/tabs', route: TabsRoutes },
  { path: '/insights', route: InsightsRoutes },
  { path: '/healthcareconsultant', route: HealthcareconsultantRoutes },
  { path: '/challenges', route: ChallengesRoutes },
  { path: '/bookings', route: BookingsRoutes },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
  { path: '/notification', route: NotificationRoutes },
  { path: '/faq', route: FaqRoutes },
  { path: '/public', route: PublicRoutes },

  { path: '/review', route: ReviewRoutes },
  { path: '/file', route: fileRoutes },

  { path: '/about', route: AboutRoutes },
]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
