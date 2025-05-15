import crypto from 'crypto'
import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'

// Environment variables
const ENCRYPTION_KEY = process.env.FILE_ENCRYPTION_KEY || ''
const ENCRYPTION_IV = process.env.FILE_ENCRYPTION_IV || ''
const ENCRYPTED_FILES_PATH =
  process.env.ENCRYPTED_FILES_PATH || './uploads/encrypted'

// Ensure the encryption key and IV are properly set
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error(
    'Invalid encryption key. Must be a 32-byte (64 hex characters) string',
  )
}

if (!ENCRYPTION_IV || ENCRYPTION_IV.length !== 32) {
  throw new Error(
    'Invalid encryption IV. Must be a 16-byte (32 hex characters) string',
  )
}

// Convert hex strings to buffers
const key = Buffer.from(ENCRYPTION_KEY, 'hex')
const iv = Buffer.from(ENCRYPTION_IV, 'hex')

// Ensure encrypted files directory exists
fs.ensureDirSync(ENCRYPTED_FILES_PATH)

/**
 * Encrypts a file using AES-256-CBC
 * @param sourcePath Path to the source file
 * @returns Object containing the encrypted file path and other metadata
 */
const encryptFile = async (
  sourcePath: string,
): Promise<{
  encryptedPath: string
  originalName: string
  encryptedName: string
}> => {
  try {
    // Generate a unique filename for the encrypted file
    const originalName = path.basename(sourcePath)
    const encryptedName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.enc`
    const encryptedPath = path.join(ENCRYPTED_FILES_PATH, encryptedName)

    // Create read and write streams
    const readStream = fs.createReadStream(sourcePath)
    const writeStream = fs.createWriteStream(encryptedPath)

    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

    // Pipe the file through the cipher
    readStream.pipe(cipher).pipe(writeStream)

    // Wait for encryption to complete
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    // Delete the original file
    await fs.unlink(sourcePath)

    return {
      encryptedPath,
      originalName,
      encryptedName,
    }
  } catch (error) {
    console.error('Error encrypting file:', error)
    throw error
  }
}

/**
 * Decrypts a file to a temporary location
 * @param encryptedPath Path to the encrypted file
 * @param originalName Original file name (for content-disposition)
 * @returns Path to the temporary decrypted file
 */
const decryptFile = async (
  encryptedPath: string,
  originalName: string,
): Promise<string> => {
  try {
    // Create a temporary file path for the decrypted file
    const tempDir = path.join(process.cwd(), 'temp')
    await fs.ensureDir(tempDir)

    const tempFilePath = path.join(tempDir, originalName)

    // Create read and write streams
    const readStream = fs.createReadStream(encryptedPath)
    const writeStream = fs.createWriteStream(tempFilePath)

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)

    // Pipe the file through the decipher
    readStream.pipe(decipher).pipe(writeStream)

    // Wait for decryption to complete
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    return tempFilePath
  } catch (error) {
    console.error('Error decrypting file:', error)
    throw error
  }
}

/**
 * Deletes a temporary file
 * @param filePath Path to the temporary file
 */
const deleteTempFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    console.error('Error deleting temporary file:', error)
  }
}

export const FileService = {
  encryptFile,
  decryptFile,
  deleteTempFile,
}
