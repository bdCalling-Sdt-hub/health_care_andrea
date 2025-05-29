import express from 'express'
import { UserController } from './user.controller'
import { UserValidations } from './user.validation'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'

const router = express.Router()

router.post(
  '/create-user',
  validateRequest(UserValidations.createUserZodSchema),
  UserController.createUser,
)

router.patch(
  '/profile',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.GUEST),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(UserValidations.updateUserZodSchema),
  UserController.updateProfile,
)
router.get(
  '/profile',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.GUEST),
  UserController.getProfile,
)

router.post('/schedule', auth(USER_ROLES.ADMIN), UserController.manageSchedule)
router.get(
  '/schedule',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getSchedule,
)
router.get('/schedule/:date', UserController.getAvailableTime)

router.get('/all-users', auth(USER_ROLES.ADMIN), UserController.getAllUsers)
export const UserRoutes = router
