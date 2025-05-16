import express from 'express'
import multer from 'multer'
import path from 'path'

import fs from 'fs-extra'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import { FileController } from './file.controller'
fs.ensureDirSync('./uploads/temp')
const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/temp') // Temporary storage before encryption
  },
  filename: (req, file, cb) => {
    // Create a safe filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

// Create upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 40 * 1024 * 1024, // 40MB limit
  },
})

// Ensure temp directory exists

// Routes
router.post(
  '/upload',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  upload.single('file'),
  FileController.uploadFile,
)
router.get(
  '/download/:fileId',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  FileController.downloadFile,
)
router.get(
  '/user/:userId',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  FileController.getFileByUser,
)
router.get(
  '/metadata/:fileId',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  FileController.getFileMetadata,
)

export const fileRoutes = router
