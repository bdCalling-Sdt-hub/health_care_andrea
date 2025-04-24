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
]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
