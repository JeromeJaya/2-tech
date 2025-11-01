const fs = require('fs/promises');
const path = require('path');
const { config } = require('../config/env');
const logger = require('../utils/logger');
const Photo = require('../models/Photo'); // Assuming you have a Photo model

// --- Configuration ---
const UPLOAD_DIR = config.uploadDir || path.join(__dirname, '../../uploads');
const STORAGE_TYPE = 'local'; // Change to 's3' to enable AWS S3

// Ensure upload directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(err => {
  if (err.code !== 'EEXIST') {
    logger.error('Failed to create upload directory:', err);
  }
});

// --- Local Storage Implementation ---
const saveLocalFile = async (file) => {
  // Multer already saved the file, we just return the relative path
  const relativePath = `/uploads/${file.filename}`;
  logger.debug(`File saved locally: ${relativePath}`);
  return relativePath;
};

const deleteLocalFile = async (filePath) => {
  try {
    // filePath is like '/uploads/filename.jpg'
    const absolutePath = path.join(__dirname, '../..', filePath);
    await fs.unlink(absolutePath);
    logger.debug(`Local file deleted: ${filePath}`);
  } catch (error) {
    // If file doesn't exist, ignore the error
    if (error.code !== 'ENOENT') {
      logger.error(`Error deleting local file ${filePath}:`, error);
      // throw new Error(`Failed to delete local file: ${filePath}`);
    } else {
        logger.warn(`Attempted to delete non-existent file: ${filePath}`);
    }
  }
};

const getLocalFileUrl = (filePath) => {
  // Assuming the server serves /uploads statically
  // You might need to prepend the base URL in the frontend or here
  // Example: return `${config.appUrl}${filePath}`;
  return filePath;
};


// --- AWS S3 Implementation (Placeholder) ---
// import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({ region: "your-region" }); // Configure AWS SDK
// const BUCKET_NAME = "your-s3-bucket-name";

// const saveS3File = async (file) => {
//   const key = `uploads/${Date.now()}-${file.originalname}`;
//   const command = new PutObjectCommand({
//     Bucket: BUCKET_NAME,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   });
//   await s3Client.send(command);
//   const url = `https://${BUCKET_NAME}.s3.your-region.amazonaws.com/${key}`;
//   logger.debug(`File uploaded to S3: ${url}`);
//   return url; // Return the S3 URL
// };

// const deleteS3File = async (fileUrl) => {
//   try {
//     const urlParts = new URL(fileUrl);
//     const key = urlParts.pathname.substring(1); // Remove leading '/'
//     const command = new DeleteObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: key,
//     });
//     await s3Client.send(command);
//     logger.debug(`S3 file deleted: ${key}`);
//   } catch (error) {
//     logger.error(`Error deleting S3 file ${fileUrl}:`, error);
//     // throw new Error(`Failed to delete S3 file: ${fileUrl}`);
//   }
// };

// const getS3FileUrl = (fileUrl) => {
//   return fileUrl; // URL is already absolute
// };


// --- Service Interface ---

exports.storageService = {
  /**
   * Saves an uploaded file based on the configured storage type.
   * @param file The file object from Multer.
   * @returns The URL or path of the saved file.
   */
  async saveFile(file) {
    if (STORAGE_TYPE === 's3') {
      // return saveS3File(file); // Uncomment for S3
      throw new Error("S3 storage not implemented");
    } else {
      return saveLocalFile(file);
    }
  },

  /**
   * Deletes a file based on the configured storage type.
   * @param fileIdentifier The URL or path of the file to delete.
   */
  async deleteFile(fileIdentifier) {
     if (!fileIdentifier) {
        logger.warn('Attempted to delete file with empty identifier.');
        return;
     }
    if (STORAGE_TYPE === 's3') {
      // return deleteS3File(fileIdentifier); // Uncomment for S3
        throw new Error("S3 storage not implemented");
    } else {
      // Ensure it's a local path before deleting
      if (fileIdentifier.startsWith('/uploads/')) {
        return deleteLocalFile(fileIdentifier);
      } else {
        logger.warn(`Skipping deletion of non-local file identifier: ${fileIdentifier}`);
      }
    }
  },

  /**
   * Gets the public URL for a stored file.
   * @param fileIdentifier The URL or path of the stored file.
   * @returns The publicly accessible URL.
   */
  getFileUrl(fileIdentifier) {
     if (!fileIdentifier) return '';
    if (STORAGE_TYPE === 's3') {
      // return getS3FileUrl(fileIdentifier); // Uncomment for S3
        throw new Error("S3 storage not implemented");
    } else {
      return getLocalFileUrl(fileIdentifier);
    }
  },

  /**
   * Deletes photos associated with a Photo document.
   * @param photoDocument The Mongoose Photo document.
   */
   async deletePhotoDocumentFile(photoDocument) {
     if (photoDocument && photoDocument.url) {
       await this.deleteFile(photoDocument.url);
       // Optionally delete thumbnail if you implement thumbnail generation
       // if (photoDocument.thumbnailUrl) {
       //   await this.deleteFile(photoDocument.thumbnailUrl);
       // }
     } else {
         logger.warn(`Photo document or URL missing, cannot delete file for ID: ${photoDocument?._id}`);
     }
   }
};
