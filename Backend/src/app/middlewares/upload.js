const multer = require('multer');

// Cấu hình storage cho multer (lưu tạm thời trong memory)
const storage = multer.memoryStorage();

// Middleware upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Kiểm tra loại file
        const allowedMimes = [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif',
            'video/mp4',
            'video/quicktime',
            'video/x-msvideo'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Định dạng file không được hỗ trợ'), false);
        }
    }
});

module.exports = upload;
