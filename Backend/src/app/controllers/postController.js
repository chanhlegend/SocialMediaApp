const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const cloudinaryService = require("../services/cloudinaryService");

class postController {
    // Tạo bài viết mới
    async createPost(req, res) {
        try {
            const { content } = req.body;
            const userId = req.user._id; // Giả sử có middleware auth để lấy user
            
            // Kiểm tra nếu không có content và không có file
            if (!content && (!req.files || req.files.length === 0)) {
                return res.status(400).json({
                    success: false,
                    message: "Bài viết phải có nội dung hoặc hình ảnh/video"
                });
            }

            let mediaArray = [];
            
            // Upload file lên Cloudinary nếu có
            if (req.files && req.files.length > 0) {
                try {
                    console.log('Đang upload', req.files.length, 'file(s) lên Cloudinary...');
                    mediaArray = await cloudinaryService.uploadMultipleFiles(req.files);
                    console.log('Upload thành công:', mediaArray.length, 'file(s)');
                } catch (uploadError) {
                    console.error('Lỗi upload lên Cloudinary:', uploadError);
                    return res.status(500).json({
                        success: false,
                        message: "Lỗi upload media",
                        error: uploadError.message
                    });
                }
            }

            // Tạo bài viết mới
            const newPost = new Post({
                user: userId,
                content: content || "",
                media: mediaArray
            });

            const savedPost = await newPost.save();
            
            // Populate thông tin user
            await savedPost.populate('user', 'username email');

            res.status(201).json({
                success: true,
                message: "Tạo bài viết thành công",
                data: savedPost
            });

        } catch (error) {
            console.error("Lỗi tạo bài viết:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message
            });
        }
    }

    // Lấy tất cả bài viết (có phân trang)
    async getAllPosts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const posts = await Post.find()
                .populate('user', 'username email')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'username email'
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Post.countDocuments();
            const totalPages = Math.ceil(total / limit);

            res.status(200).json({
                success: true,
                data: posts,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalPosts: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.error("Lỗi lấy danh sách bài viết:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message
            });
        }
    }

    // Lấy bài viết theo ID
    async getPostById(req, res) {
        try {
            const { postId } = req.params;

            const post = await Post.findById(postId)
                .populate('user', 'username email')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'username email'
                    }
                });

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài viết"
                });
            }

            res.status(200).json({
                success: true,
                data: post
            });

        } catch (error) {
            console.error("Lỗi lấy bài viết:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message
            });
        }
    }

    // Lấy bài viết theo user ID
    async getPostsByUserId(req, res) {
        try {
            const { userId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const posts = await Post.find({ user: userId })
                .populate('user', 'username email')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'username email'
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Post.countDocuments({ user: userId });
            const totalPages = Math.ceil(total / limit);

            res.status(200).json({
                success: true,
                data: posts,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalPosts: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });

        } catch (error) {
            console.error("Lỗi lấy bài viết theo user:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message
            });
        }
    }

    // Cập nhật bài viết
    async updatePost(req, res) {
        try {
            const { postId } = req.params;
            const { content } = req.body;
            const userId = req.user._id;

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài viết"
                });
            }

            // Kiểm tra quyền sở hữu
            if (post.user.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Bạn không có quyền chỉnh sửa bài viết này"
                });
            }

            let mediaArray = post.media;

            // Nếu có file mới được upload
            if (req.files && req.files.length > 0) {
                try {
                    // Xóa media cũ từ Cloudinary
                    if (post.media && post.media.length > 0) {
                        await cloudinaryService.deleteMultipleFiles(post.media);
                    }
                    
                    // Upload media mới
                    mediaArray = await cloudinaryService.uploadMultipleFiles(req.files);
                } catch (uploadError) {
                    return res.status(500).json({
                        success: false,
                        message: "Lỗi upload media",
                        error: uploadError.message
                    });
                }
            }

            // Cập nhật bài viết
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    content: content || post.content,
                    media: mediaArray
                },
                { new: true, runValidators: true }
            ).populate('user', 'username email');

            res.status(200).json({
                success: true,
                message: "Cập nhật bài viết thành công",
                data: updatedPost
            });

        } catch (error) {
            console.error("Lỗi cập nhật bài viết:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message
            });
        }
    }

    // Xóa bài viết
    async deletePost(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user._id;

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài viết"
                });
            }

            // Kiểm tra quyền sở hữu
            if (post.user.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Bạn không có quyền xóa bài viết này"
                });
            }

            // Xóa media từ Cloudinary
            if (post.media && post.media.length > 0) {
                try {
                    await cloudinaryService.deleteMultipleFiles(post.media);
                } catch (deleteError) {
                    console.error("Lỗi xóa media từ Cloudinary:", deleteError);
                }
            }

            // Xóa tất cả comment liên quan
            await Comment.deleteMany({ post: postId });

            // Xóa bài viết
            await Post.findByIdAndDelete(postId);

            res.status(200).json({
                success: true,
                message: "Xóa bài viết thành công"
            });

        } catch (error) {
            console.error("Lỗi xóa bài viết:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message
            });
        }
    }

    // Like/Unlike bài viết
    async toggleLikePost(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user._id;

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài viết"
                });
            }

            const isLiked = post.likes.includes(userId);
            
            if (isLiked) {
                // Unlike
                post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            } else {
                // Like
                post.likes.push(userId);
            }

            await post.save();

            res.status(200).json({
                success: true,
                message: isLiked ? "Đã bỏ thích bài viết" : "Đã thích bài viết",
                data: {
                    isLiked: !isLiked,
                    totalLikes: post.likes.length
                }
            });

        } catch (error) {
            console.error("Lỗi toggle like:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message
            });
        }
    }

    // Thêm comment vào bài viết
    async addComment(req, res) {
        try {
            const { postId } = req.params;
            const { content } = req.body;
            const userId = req.user._id;

            if (!content || content.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Nội dung comment không được để trống"
                });
            }

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài viết"
                });
            }

            // Tạo comment mới
            const newComment = new Comment({
                post: postId,
                user: userId,
                content: content.trim()
            });

            const savedComment = await newComment.save();
            
            // Thêm comment ID vào post
            post.comments.push(savedComment._id);
            await post.save();

            // Populate thông tin user cho comment
            await savedComment.populate('user', 'username email');

            res.status(201).json({
                success: true,
                message: "Thêm comment thành công",
                data: savedComment
            });

        } catch (error) {
            console.error("Lỗi thêm comment:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message
            });
        }
    }
}

module.exports = new postController();
