import { Document, Types } from 'mongoose'

// Interface for access log entries
export interface IAccessLog {
  timestamp: Date
  action: string
  userId: Types.ObjectId
  userIp?: string
}

// Interface for the encrypted file document
export interface IEncryptedFile extends Document {
  originalName: string
  s3Key: string // S3 object key
  s3Bucket: string // S3 bucket name
  encryptionKeyId: string // Reference to the encryption key used
  mimeType: string
  size: number
  uploadedBy: Types.ObjectId
  uploadTimestamp: Date
  accessLogs: IAccessLog[]
}

// Interface for file upload response
export interface IFileUploadResponse {
  fileId: string
  originalName: string
  mimeType: string
  size: number
  uploadedBy: string
  uploadTimestamp: Date
}
