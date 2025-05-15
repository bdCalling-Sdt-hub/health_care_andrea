import mongoose, { Document, Schema } from 'mongoose'

// Interface for access log entries
interface AccessLog {
  timestamp: Date
  action: string
  userId: mongoose.Types.ObjectId
  userIp?: string
}

// Interface for the encrypted file document
export interface IEncryptedFile extends Document {
  originalName: string
  encryptedPath: string
  encryptedName: string
  mimeType: string
  size: number
  uploadedBy: mongoose.Types.ObjectId
  uploadTimestamp: Date
  accessLogs: AccessLog[]
}

// Schema for access logs
const AccessLogSchema = new Schema<AccessLog>({
  timestamp: { type: Date, required: true, default: Date.now },
  action: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userIp: { type: String },
})

// Schema for encrypted files
const EncryptedFileSchema = new Schema<IEncryptedFile>({
  originalName: { type: String, required: true },
  encryptedPath: { type: String, required: true },
  encryptedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadTimestamp: { type: Date, default: Date.now },
  accessLogs: [AccessLogSchema],
})

// Create and export the model
const EncryptedFile = mongoose.model<IEncryptedFile>(
  'EncryptedFile',
  EncryptedFileSchema,
)
export default EncryptedFile
