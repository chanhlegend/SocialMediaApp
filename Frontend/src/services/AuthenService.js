import axios from "axios";

const API_URL = "http://localhost:3000/api/authen";

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
          const response = await axios.post(`${API_URL}/refresh-token`, {
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
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

export const AuthenService = {
  registerUser: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return {
        success: true,
        data: response.data,
        message: "Registration successful"
      };
    } catch (error) {
      console.error("Registration service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed"
      };
    }
  },
  verifyOTP: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, data);
      return {
        success: true,
        data: response.data,
        message: "OTP verification successful"
      };
    } catch (error) {
      console.error("OTP verification service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "OTP verification failed"
      };
    }
  },
  resendOTP: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/resend-otp`, data);
      return {
        success: true,
        data: response.data,
        message: "OTP resend successful"
      };
    } catch (error) {
      console.error("OTP resend service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "OTP resend failed"
      };
    }
  },
  login: async (data) => {
    try {
      const response = await api.post('/login', data);
      
      // Lưu tokens và user info vào localStorage
      if (response.data.success && response.data.data.tokens) {
        localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || "Login successful"
      };
    } catch (error) {
      console.error("Login service error:", error);
      
      // Xử lý trường hợp cần OTP (status 403)
      if (error.response?.status === 403 && error.response?.data?.requireOTP) {
        return {
          success: false,
          requireOTP: true,
          email: error.response.data.email,
          message: error.response.data.message
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/logout');
      
      // Xóa tokens khỏi localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: true,
        message: "Logout successful"
      };
    } catch (error) {
      console.error("Logout service error:", error);
      
      // Vẫn xóa tokens local dù API call fail
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed"
      };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return {
        success: true,
        data: response.data.data,
        message: "Profile fetched successfully"
      };
    } catch (error) {
      console.error("Get profile service error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch profile"
      };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/verify-token');
      return {
        success: true,
        data: response.data.data,
        message: "Token is valid"
      };
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return {
        success: false,
        message: "Token is invalid"
      };
    }
  },

  // Refresh token manually
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await axios.post(`${API_URL}/refresh-token`, {
        refreshToken: refreshToken
      });

      const newAccessToken = response.data.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);

      return {
        success: true,
        data: { accessToken: newAccessToken },
        message: "Token refreshed successfully"
      };
    } catch (error) {
      console.error("Refresh token service error:", error);
      
      // Clear tokens if refresh fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        message: error.response?.data?.message || "Failed to refresh token"
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      console.error("Error parsing user from localStorage");
      return null;
    }
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },
};
