const express = require('express');
const router = express.Router();
const postController = require('../app/controllers/postController');
const upload = require('../app/middlewares/upload');
const authMiddleware = require('../app/middlewares/auth');

// Public routes (có thể xem post mà không cần đăng nhập)
router.get('/', authMiddleware.optionalAuth, postController.getAllPosts); // Lấy tất cả bài viết
router.get('/:postId', authMiddleware.optionalAuth, postController.getPostById); // Lấy bài viết theo ID
router.get('/user/:userId', authMiddleware.optionalAuth, postController.getPostsByUserId); // Lấy bài viết theo user ID

// Protected routes (cần đăng nhập)
router.post('/', authMiddleware.requireAuth, upload.array('media', 5), postController.createPost); // Tạo bài viết mới (tối đa 5 file)
router.put('/:postId', authMiddleware.requireAuth, upload.array('media', 5), postController.updatePost); // Cập nhật bài viết
router.delete('/:postId', authMiddleware.requireAuth, postController.deletePost); // Xóa bài viết

// Routes cho Like/Comment (cần đăng nhập)
router.post('/:postId/like', authMiddleware.requireAuth, postController.toggleLikePost); // Like/Unlike bài viết
router.post('/:postId/comment', authMiddleware.requireAuth, postController.addComment); // Thêm comment

module.exports = router;
