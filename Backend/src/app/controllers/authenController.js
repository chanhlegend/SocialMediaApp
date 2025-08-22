const User = require("../models/user.model");
const bcrypt = require("bcrypt");
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

      return res.status(200).json({ 
        message: "Đăng nhập thành công",
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          status: user.status
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }
}
module.exports = new authenController();
