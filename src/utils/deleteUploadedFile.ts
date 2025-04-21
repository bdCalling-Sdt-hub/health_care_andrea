import path from 'path'
import fs from 'fs'
import sharp from 'sharp'

/**
 * Removes uploaded files from the filesystem
 * @param filePaths - Single file path or array of file paths to remove
 * @returns boolean indicating success or failure
 */
export const removeUploadedFiles = (
  filePaths: string | string[] | undefined,
): boolean => {
  if (!filePaths) return false

  try {
    const uploadsDir = path.join(process.cwd(), 'uploads')

    // Handle both single path and array of paths
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths]

    paths.forEach(filePath => {
      // Remove leading slash if present
      const normalizedPath = filePath.startsWith('/')
        ? filePath.substring(1)
        : filePath

      // Create absolute path
      const absolutePath = path.join(uploadsDir, normalizedPath)

      // Check if file exists before attempting to delete
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath)
        console.log(`Deleted file: ${absolutePath}`)
      } else {
        console.log(`File not found: ${absolutePath}`)
      }
    })

    return true
  } catch (error) {
    console.error('Error removing uploaded files:', error)
    return false
  }
}
