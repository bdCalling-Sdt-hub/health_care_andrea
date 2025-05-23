import mongoose, { Schema } from 'mongoose'
import { IAccessLog, IEncryptedFile } from './file.interface'

// Schema for access logs
const AccessLogSchema = new Schema<IAccessLog>(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    action: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userIp: { type: String },
  },
  { _id: false },
)

// Schema for encrypted files
const EncryptedFileSchema = new Schema<IEncryptedFile>(
  {
    originalName: { type: String, required: true },
    s3Key: { type: String, required: true },
    s3Bucket: { type: String, required: true },
    encryptionKeyId: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadTimestamp: { type: Date, default: Date.now },
    accessLogs: [AccessLogSchema],
  },
  { timestamps: true },
)

// Create and export the model
const EncryptedFile = mongoose.model<IEncryptedFile>(
  'EncryptedFile',
  EncryptedFileSchema,
)

export default EncryptedFile
