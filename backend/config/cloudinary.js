import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Configure Cloudinary
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'shop_mart_products', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Allowed file formats
        transformation: [{ width: 500, height: 500, crop: 'limit' }], // Auto resize
    },
});

// Multer upload configuration
export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Export cloudinary for direct use
export { cloudinary };