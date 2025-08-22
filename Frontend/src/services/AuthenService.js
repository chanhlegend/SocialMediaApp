import axios from "axios";

const API_URL = "http://localhost:3000/api/authen";

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
      const response = await axios.post(`${API_URL}/login`, data);
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
};
