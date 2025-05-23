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
    cb(null, './uploads/temp') // Temporary storage before encryption and S3 upload
  },
  filename: (req, file, cb) => {
    // Create a safe filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  },
})
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'text/plain',
    'text/csv',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Invalid file type. Only images, PDFs, Office documents, and text files are allowed.',
      ),
      false,
    )
  }
}

// Create upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB limit
  },
})

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
