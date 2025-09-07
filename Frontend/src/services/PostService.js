import axios from "axios";

const API_URL = "http://localhost:3000/api/posts";

// Tạo axios instance với interceptors
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor để tự động thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('http://localhost:3000/api/authen/refresh-token', {
            refreshToken: refreshToken
          });

          const newAccessToken = response.data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          // Retry original request với token mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh token cũng hết hạn, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const PostService = {
  // Tạo bài viết mới
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      
      // Thêm content nếu có
      if (postData.content && postData.content.trim()) {
        formData.append('content', postData.content.trim());
      }
      
      // Thêm media files nếu có
      if (postData.media && postData.media.length > 0) {
        postData.media.forEach((file) => {
          formData.append('media', file);
        });
      }

      const response = await api.post('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds timeout
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Đăng bài thành công"
      };
    } catch (error) {
      console.error("Create post service error:", error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          message: "Timeout: Upload mất quá nhiều thời gian"
        };
      }
      
      if (error.response?.status === 413) {
        return {
          success: false,
          message: "File quá lớn. Vui lòng chọn file nhỏ hơn"
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Đăng bài thất bại"
      };
    }
  },

  // Lấy tất cả bài viết với pagination
  getAllPosts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
        message: "Lấy danh sách bài viết thành công"
      };
    } catch (error) {
      console.error("Get all posts service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Lấy danh sách bài viết thất bại"
      };
    }
  },

  // Lấy bài viết theo ID
  getPostById: async (postId) => {
    try {
      const response = await api.get(`/${postId}`);
      return {
        success: true,
        data: response.data.data,
        message: "Lấy bài viết thành công"
      };
    } catch (error) {
      console.error("Get post by ID service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Lấy bài viết thất bại"
      };
    }
  },

  // Lấy bài viết theo user ID
  getPostsByUserId: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/user/${userId}?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
        message: "Lấy bài viết của người dùng thành công"
      };
    } catch (error) {
      console.error("Get posts by user ID service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Lấy bài viết của người dùng thất bại"
      };
    }
  },

  // Cập nhật bài viết
  updatePost: async (postId, postData) => {
    try {
      const formData = new FormData();
      
      if (postData.content !== undefined) {
        formData.append('content', postData.content);
      }
      
      if (postData.media && postData.media.length > 0) {
        postData.media.forEach((file) => {
          formData.append('media', file);
        });
      }

      const response = await api.put(`/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Cập nhật bài viết thành công"
      };
    } catch (error) {
      console.error("Update post service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Cập nhật bài viết thất bại"
      };
    }
  },

  // Xóa bài viết
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/${postId}`);
      return {
        success: true,
        message: response.data.message || "Xóa bài viết thành công"
      };
    } catch (error) {
      console.error("Delete post service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Xóa bài viết thất bại"
      };
    }
  },

  // Like/Unlike bài viết
  toggleLikePost: async (postId) => {
    try {
      const response = await api.post(`/${postId}/like`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error("Toggle like post service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Thao tác thất bại"
      };
    }
  },

  // Thêm comment
  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/${postId}/comment`, {
        content: content
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Thêm comment thành công"
      };
    } catch (error) {
      console.error("Add comment service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Thêm comment thất bại"
      };
    }
  },

  // Validate file trước khi upload
  validateFile: (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'Định dạng file không được hỗ trợ. Chỉ hỗ trợ JPG, PNG, GIF, MP4, MOV, AVI'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        message: 'Kích thước file quá lớn. Tối đa 50MB'
      };
    }

    return {
      valid: true,
      message: 'File hợp lệ'
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }
};
