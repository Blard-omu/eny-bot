"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const tslib_1 = require("tslib");
const multer_1 = tslib_1.__importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const imageFileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error('Invalid file type. Only images allowed.'));
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => ({
        folder: 'blogx/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        // transformation: {width: 300, height:300, crop: 'fill', gravity: 'face', quality: 'auto'},
        public_id: `${file.fieldname}-${Date.now()}`,
    }),
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
