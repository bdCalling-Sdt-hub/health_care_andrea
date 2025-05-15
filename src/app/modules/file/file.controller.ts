import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import fs from 'fs-extra'
import { FileService } from './file.service'
import EncryptedFile from './file.encryption'
import sendResponse from '../../../shared/sendResponse'
import { JwtPayload } from 'jsonwebtoken'

const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if file exists in request
    if (!req.file) {
      sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'No file uploaded',
      })
      return
    }

    // Get file details from multer
    const { path: filePath, originalname, mimetype, size } = req.file

    // Encrypt the file
    const { encryptedPath, originalName, encryptedName } =
      await FileService.encryptFile(filePath)
    const { authId } = req.user as JwtPayload

    // Create file metadata in MongoDB
    const fileRecord = await EncryptedFile.create({
      originalName,
      encryptedPath,
      encryptedName,
      mimeType: mimetype,
      size,
      uploadedBy: authId, // Assuming req.user is set by your auth middleware
      uploadTimestamp: new Date(),
      accessLogs: [], // Empty on creation
    })

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'File uploaded and encrypted successfully',
    })
  } catch (error) {
    console.error('Error in file upload:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to upload and encrypt file',
    })
  }
}

const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params

    // Find file metadata in MongoDB
    const fileRecord = await EncryptedFile.findById(fileId)

    if (!fileRecord) {
      sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: 'File not found',
      })
      return
    }

    // Check if encrypted file exists
    if (!(await fs.pathExists(fileRecord.encryptedPath))) {
      sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: 'Encrypted file not found',
      })
      return
    }

    // Decrypt the file to a temporary location
    const tempFilePath = await FileService.decryptFile(
      fileRecord.encryptedPath,
      fileRecord.originalName,
    )

    const { authId } = req.user as JwtPayload
    // Log the access
    fileRecord.accessLogs.push({
      timestamp: new Date(),
      action: 'download',
      userId: authId, // Assuming req.user is set by your auth middleware
      userIp: req.ip,
    })

    await fileRecord.save()

    // Send the file
    res.download(tempFilePath, fileRecord.originalName, async err => {
      // Delete the temporary file after sending (or if there's an error)
      await FileService.deleteTempFile(tempFilePath)

      if (err) {
        console.error('Error sending file:', err)
      }
    })
  } catch (error) {
    console.error('Error in file download:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to download file',
    })
  }
}

const getFileMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params

    // Find file metadata in MongoDB
    const fileRecord = await EncryptedFile.findById(fileId)
      .select('-encryptedPath -encryptedName') // Don't expose sensitive paths
      .populate('uploadedBy', 'name email') // Assuming your User model has these fields

    if (!fileRecord) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'File not found' })
      return
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'File metadata retrieved successfully',
      data: fileRecord,
    })
  } catch (error) {
    console.error('Error getting file metadata:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to get file metadata',
    })
  }
}

export const FileController = {
  uploadFile,
  downloadFile,
  getFileMetadata,
}
