import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export class CloudinaryService {
  /**
   * Upload an image to Cloudinary
   * @param fileBuffer - The image file buffer
   * @param fileName - The name to give the file on Cloudinary
   * @param folder - The folder to upload the image to
   * @returns The URL of the uploaded image
   */
  async uploadImage(fileBuffer: Buffer, fileName: string, folder: string = 'workers'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: fileName,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        }
      );

      // Convert buffer to stream
      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  /**
   * Delete an image from Cloudinary
   * @param publicId - The public ID of the image to delete
   * @returns True if deletion was successful
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      return false;
    }
  }

  /**
   * Generate a public ID from a URL
   * @param url - The Cloudinary URL
   * @returns The public ID
   */
  getPublicIdFromUrl(url: string): string {
    // Extract public ID from Cloudinary URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
    // Public ID would be: folder/image
    const parts = url.split('/');
    
    // Check if parts array has enough elements
    if (parts.length < 2) {
      throw new Error('Invalid URL format: unable to extract filename and folder');
    }
    
    const fileNameWithExtension = parts[parts.length - 1];
    
    // Handle case where fileNameWithExtension might be undefined or empty
    if (!fileNameWithExtension) {
      throw new Error('Invalid URL format: unable to extract filename');
    }
    
    // Handle case where fileNameWithExtension doesn't contain a dot
    const fileNameParts = fileNameWithExtension.split('.');
    const fileName = fileNameParts[0];
    
    // Handle case where folder might be undefined
    const folder = parts[parts.length - 2];
    if (!folder) {
      throw new Error('Invalid URL format: unable to extract folder');
    }
    
    return `${folder}/${fileName}`;
  }
}