const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwtService = require("../services/jwtService");

class authenController {

  async registerUser(req, res) {
    try {
      const { email, password, fullName } = req.body;

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      // Tạo OTP và hash mật khẩu
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút
      const hashedPassword = await bcrypt.hash(password, 10);

      // Lưu người dùng vào cơ sở dữ liệu
      const newUser = new User({
        email,
        password: hashedPassword,
        fullName: fullName,
        otp,
        otpExpires,
      });

      await newUser.save();

      // Gửi email OTP
      const transporter = req.app.get("transporter");
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mã xác nhận OTP",
        text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        return res
          .status(201)
          .json({ message: "User created successfully. OTP sent to email." });
      } catch (error) {
        // Xóa người dùng nếu gửi email thất bại
        await User.findByIdAndDelete(newUser._id);
        return res
          .status(500)
          .json({ message: "Failed to send OTP email", error });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      await User.findByIdAndUpdate(user._id, {
        status: "active",
        otp: null,
        otpExpires: null,
      });
      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  async resendOTP(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Tạo lại OTP và cập nhật thời gian hết hạn
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

      await User.findByIdAndUpdate(user._id, {
        otp,
        otpExpires,
      });

      // Gửi email OTP mới
      const transporter = req.app.get("transporter");
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mã xác nhận OTP",
        text: `Mã OTP mới của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "OTP đã được gửi lại" });
      } catch (error) {
        return res.status(500).json({ message: "Failed to send OTP email", error });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email không tồn tại" });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng" });
      }

      // Kiểm tra status của user
      if (user.status === "non-active") {
        // Tạo OTP mới cho user chưa xác thực
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

        await User.findByIdAndUpdate(user._id, {
          otp,
          otpExpires,
        });

        // Gửi email OTP
        const transporter = req.app.get("transporter");
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Mã xác nhận OTP",
          text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
        };

        try {
          await transporter.sendMail(mailOptions);
          return res.status(403).json({ 
            message: "Tài khoản chưa được xác thực. Mã OTP đã được gửi đến email của bạn.",
            requireOTP: true,
            email: email
          });
        } catch (error) {
          return res.status(500).json({ message: "Không thể gửi email OTP", error });
        }
      }

      if (user.status === "banned") {
        return res.status(403).json({ message: "Tài khoản đã bị khóa" });
      }

      // Tạo JWT tokens
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role || 'user'
      };

      const tokens = jwtService.generateTokens(tokenPayload);

      // Lưu refresh token vào database (optional - để có thể revoke)
      await User.findByIdAndUpdate(user._id, {
        refreshToken: tokens.refreshToken,
        lastLogin: new Date()
      });

      return res.status(200).json({ 
        success: true,
        message: "Đăng nhập thành công",
        data: {
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            status: user.status,
            role: user.role || 'user'
          },
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ 
        message: "Server error", 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token is required"
        });
      }

      // Verify refresh token
      const decoded = jwtService.verifyRefreshToken(refreshToken);
      
      // Tìm user và kiểm tra refresh token
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token"
        });
      }

      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: "Account is not active"
        });
      }

      // Tạo access token mới
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role || 'user'
      };

      const newAccessToken = jwtService.generateAccessToken(tokenPayload);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: newAccessToken
        }
      });

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        error: error.message
      });
    }
  }

  // Logout - invalidate refresh token
  async logout(req, res) {
    try {
      const userId = req.user._id;

      // Xóa refresh token khỏi database
      await User.findByIdAndUpdate(userId, {
        refreshToken: null
      });

      return res.status(200).json({
        success: true,
        message: "Đăng xuất thành công"
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = req.user;

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            status: user.status,
            role: user.role || 'user',
            // Profile information
            bio: user.bio,
            dateOfBirth: user.dateOfBirth,
            avatar: user.avatar,
            coverPhoto: user.coverPhoto,
            profilePrivacy: user.profilePrivacy,
            blockedUsers: user.blockedUsers,
            profileVisitors: user.profileVisitors,
            theme: user.theme,
            // Activity status
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  }

  // Verify JWT token (for frontend to check if token is still valid)
  async verifyToken(req, res) {
    try {
      // Nếu middleware auth pass thì token valid
      return res.status(200).json({
        success: true,
        message: "Token is valid",
        data: {
          user: {
            id: req.user._id,
            email: req.user.email,
            fullName: req.user.fullName,
            role: req.user.role || 'user'
          }
        }
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  }
}
module.exports = new authenController();
