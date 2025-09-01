const cloudinary = require('../../config/cloudinary');

class CloudinaryService {
    // Upload file lên Cloudinary
    async uploadFile(fileBuffer, fileName, resourceType = 'auto') {
        try {
            return new Promise((resolve, reject) => {
                const uploadOptions = {
                    folder: 'social_media_posts',
                    public_id: `post_${Date.now()}_${Math.round(Math.random() * 1E9)}`,
                    resource_type: resourceType,
                    overwrite: true,
                };

                cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(fileBuffer);
            });
        } catch (error) {
            throw new Error(`Lỗi upload file: ${error.message}`);
        }
    }

    // Upload nhiều file
    async uploadMultipleFiles(files) {
        try {
            if (!files || files.length === 0) {
                throw new Error('Không có file nào để upload');
            }

            const uploadPromises = files.map(file => {
                const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';
                return this.uploadFile(file.buffer, file.originalname, resourceType);
            });

            const results = await Promise.all(uploadPromises);
            return results.map(result => ({
                type: result.resource_type,
                url: result.secure_url,
                publicId: result.public_id
            }));
        } catch (error) {
            console.error('Lỗi upload nhiều file:', error);
            throw new Error(`Lỗi upload nhiều file: ${error.message}`);
        }
    }

    // Xóa file từ Cloudinary
    async deleteFile(publicId, resourceType = 'image') {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType
            });
            return result;
        } catch (error) {
            throw new Error(`Lỗi xóa file: ${error.message}`);
        }
    }

    // Xóa nhiều file
    async deleteMultipleFiles(mediaArray) {
        try {
            const deletePromises = mediaArray.map(media => {
                const publicId = this.extractPublicId(media.url);
                return this.deleteFile(publicId, media.type);
            });

            await Promise.all(deletePromises);
        } catch (error) {
            throw new Error(`Lỗi xóa nhiều file: ${error.message}`);
        }
    }

    // Trích xuất public_id từ URL
    extractPublicId(url) {
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        const publicId = fileName.split('.')[0];
        return `social_media_posts/${publicId}`;
    }
}

module.exports = new CloudinaryService();
