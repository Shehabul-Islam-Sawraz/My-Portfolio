import dotenv from 'dotenv';

dotenv.config({ path: "./.env" })

const configCloudinary = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
}

export default configCloudinary;
