import express from 'express'
import { ChallengesController } from './challenges.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { ChallengesValidations } from './challenges.validation'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(ChallengesValidations.createChallengeZodSchema),
  ChallengesController.createChallenges,
)
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(ChallengesValidations.updateChallengeZodSchema),
  ChallengesController.updateChallenges,
)
router.get('/', ChallengesController.getAllChallenges)
router.get('/:id', ChallengesController.getSingleChallenges)
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN),
  ChallengesController.deleteChallenges,
)

export const ChallengesRoutes = router
