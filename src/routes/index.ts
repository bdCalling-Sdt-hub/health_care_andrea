import { UserRoutes } from '../app/modules/user/user.route'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import express, { Router } from 'express'
import { ServiceRoutes } from '../app/modules/service/service.route'
import { WayRoutes } from '../app/modules/way/way.route'

const router = express.Router()

const apiRoutes: { path: string; route: Router }[] = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/service', route: ServiceRoutes },
  { path: '/way', route: WayRoutes },
]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
