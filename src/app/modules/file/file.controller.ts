import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import fs from 'fs-extra'
import { FileService } from './file.service'
import EncryptedFile from './file.model'
import sendResponse from '../../../shared/sendResponse'
import { JwtPayload } from 'jsonwebtoken'
import { IFileUploadResponse } from './file.interface'

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

    // Encrypt and upload the file to S3
    const { s3Key, originalName, encryptionKeyId, s3Bucket } =
      await FileService.encryptAndUploadFile(filePath)
    const { authId } = req.user as JwtPayload

    // Create file metadata in MongoDB
    const fileRecord = await EncryptedFile.create({
      originalName,
      s3Key,
      s3Bucket,
      encryptionKeyId,
      mimeType: mimetype,
      size,
      uploadedBy: authId,
      uploadTimestamp: new Date(),
      accessLogs: [], // Empty on creation
    })

    const response: IFileUploadResponse = {
      fileId: fileRecord._id?.toString() ?? '',
      originalName: fileRecord.originalName,
      mimeType: fileRecord.mimeType,
      size: fileRecord.size,
      uploadedBy: fileRecord.uploadedBy.toString(),
      uploadTimestamp: fileRecord.uploadTimestamp,
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'File uploaded and encrypted successfully',
      data: response,
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
    const { authId } = req.user as JwtPayload

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

    // Check if user is authorized to download the file
    // Only the uploader or admin can download
    if (fileRecord.uploadedBy.toString() !== authId.toString()) {
      // Check if user is admin (you'll need to implement this check)
      const isAdmin = req.user && (req.user as any).role === 'admin'
      if (!isAdmin) {
        sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message: 'You are not authorized to access this file',
        })
        return
      }
    }

    // Download and decrypt the file from S3
    const tempFilePath = await FileService.downloadAndDecryptFile(
      fileRecord.s3Key,
      fileRecord.s3Bucket,
      fileRecord.originalName,
    )

    // Log the access
    fileRecord.accessLogs.push({
      timestamp: new Date(),
      action: 'download',
      userId: authId,
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

const getFileByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { authId } = req.user as JwtPayload

    // Check if user is authorized to view these files
    // Users can only view their own files unless they're an admin
    if (userId !== authId) {
      // Check if user is admin (you'll need to implement this check)
      const isAdmin = req.user && (req.user as any).role === 'admin'
      if (!isAdmin) {
        sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message: 'You are not authorized to view these files',
        })
        return
      }
    }

    // Find file metadata in MongoDB
    const fileRecords = await EncryptedFile.find(
      { uploadedBy: userId },
      { accessLogs: 0 }, // exclude accessLogs
    )
      .select('-s3Key -encryptionKeyId') // Don't expose sensitive paths
      .populate('uploadedBy', 'name email profile')

    if (!fileRecords || fileRecords.length === 0) {
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'No files found for this user',
        data: [],
      })
      return
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'File metadata retrieved successfully',
      data: fileRecords,
    })
  } catch (error) {
    console.error('Error retrieving files:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to retrieve files',
    })
  }
}

const getFileMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params
    const { authId } = req.user as JwtPayload

    // Find file metadata in MongoDB
    const fileRecord = await EncryptedFile.findById(fileId, { accessLogs: 0 })
      .select('-s3Key -encryptionKeyId') // Don't expose sensitive paths
      .populate('uploadedBy', 'name email') // Assuming your User model has these fields

    if (!fileRecord) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'File not found' })
      return
    }

    // Check if user is authorized to view this file's metadata
    if (fileRecord.uploadedBy._id.toString() !== authId) {
      // Check if user is admin
      const isAdmin = req.user && (req.user as any).role === 'admin'
      if (!isAdmin) {
        sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message: 'You are not authorized to view this file',
        })
        return
      }
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
  getFileByUser,
}
