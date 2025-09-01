const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './src/.env' });

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Kiểm tra cấu hình Cloudinary
const validateCloudinaryConfig = () => {
    const requiredEnvVars = [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY', 
        'CLOUDINARY_API_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ Thiếu các biến môi trường Cloudinary:', missingVars);
        throw new Error(`Thiếu cấu hình Cloudinary: ${missingVars.join(', ')}`);
    }

    console.log('✅ Cấu hình Cloudinary thành công');
};

// Validate ngay khi load module
validateCloudinaryConfig();

module.exports = cloudinary;
