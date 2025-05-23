import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import fs from 'fs-extra'
import path from 'path'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'

import config from '../../../config'
import { logger } from '../../../shared/logger'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'

// Environment variables
const ENCRYPTION_KEY = config.encryption.secret_key
const ENCRYPTION_IV = config.encryption.iv

// Ensure the encryption key and IV are properly set
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new ApiError(
    StatusCodes.BAD_REQUEST,
    'Invalid encryption key. Must be a 32-byte (64 hex characters) string',
  )
}

if (!ENCRYPTION_IV || ENCRYPTION_IV.length !== 32) {
  throw new ApiError(
    StatusCodes.BAD_REQUEST,
    'Invalid encryption IV. Must be a 16-byte (32 hex characters) string',
  )
}

// Convert hex strings to buffers
const key = Buffer.from(ENCRYPTION_KEY, 'hex')
const iv = Buffer.from(ENCRYPTION_IV, 'hex')

// Initialize S3 client
const s3Client = new S3Client({
  region: config.aws.region,
})

const encryptAndUploadFile = async (
  sourcePath: string,
): Promise<{
  s3Key: string
  originalName: string
  encryptionKeyId: string
  s3Bucket: string
}> => {
  try {
    // Generate a unique key for the encrypted file
    const originalName = path.basename(sourcePath)
    const encryptionKeyId = crypto.randomBytes(16).toString('hex')
    const s3Key = `encrypted/${Date.now()}-${crypto.randomBytes(8).toString('hex')}`
    const s3Bucket = config.aws.bucket_name!

    // Read the file
    const fileBuffer = await fs.readFile(sourcePath)

    // Encrypt the file
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    const encryptedBuffer = Buffer.concat([
      cipher.update(fileBuffer),
      cipher.final(),
    ])

    // Upload to S3
    const uploadParams = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: encryptedBuffer,
      ServerSideEncryption: 'AES256', // Enable server-side encryption
      Metadata: {
        'x-amz-meta-encryption-key-id': encryptionKeyId,
        'x-amz-meta-original-name': encodeURIComponent(originalName),
      },
    }

    const command = new PutObjectCommand({
      ...uploadParams,
      ServerSideEncryption: 'AES256' as const,
    })
    await s3Client.send(command)

    // Delete the original file
    await fs.unlink(sourcePath)

    return {
      s3Key,
      originalName,
      encryptionKeyId,
      s3Bucket,
    }
  } catch (error) {
    logger.error('Error encrypting and uploading file:', error)
    throw error
  }
}

const downloadAndDecryptFile = async (
  s3Key: string,
  s3Bucket: string,
  originalName: string,
): Promise<string> => {
  try {
    // Create a temporary file path for the decrypted file
    const tempDir = path.join(process.cwd(), 'temp')
    await fs.ensureDir(tempDir)

    const tempFilePath = path.join(tempDir, originalName)

    // Download from S3
    const getParams = {
      Bucket: s3Bucket,
      Key: s3Key,
    }

    const command = new GetObjectCommand(getParams)
    const response = await s3Client.send(command)

    if (!response.Body) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Empty response body from S3')
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as any) {
      chunks.push(chunk)
    }
    const encryptedBuffer = Buffer.concat(chunks)

    // Decrypt the file
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ])

    // Write to temporary file
    await fs.writeFile(tempFilePath, decryptedBuffer)

    return tempFilePath
  } catch (error) {
    logger.error('Error downloading and decrypting file:', error)
    throw error
  }
}

const generatePresignedUrl = async (
  s3Key: string,
  s3Bucket: string,
  expiresIn = 900, // 15 minutes
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    logger.error('Error generating pre-signed URL:', error)
    throw error
  }
}

const deleteTempFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    logger.error('Error deleting temporary file:', error)
  }
}

export const FileService = {
  encryptAndUploadFile,
  downloadAndDecryptFile,
  generatePresignedUrl,
  deleteTempFile,
}
