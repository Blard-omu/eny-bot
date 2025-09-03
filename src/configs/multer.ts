import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const imageFileFilter = (_req: any, file: any, cb: any) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only images allowed.'));
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req: any, file: any) => ({
    folder: 'blogx/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    // transformation: {width: 300, height:300, crop: 'fill', gravity: 'face', quality: 'auto'},
    public_id: `${file.fieldname}-${Date.now()}`,
  }),
});

export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
