import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import "../../public/css/AuthPage.css"

import { AuthenService } from "../services/AuthenService"

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)

  // Xác định mode ban đầu dựa trên URL
  useEffect(() => {
    const isRegistrationPage = location.pathname === "/registration"
    setIsLogin(!isRegistrationPage)
  }, [location.pathname])
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  // Validation state
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Kiểm tra success message từ navigation state
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      // Clear navigation state để tránh hiển thị lại khi refresh
      navigate(location.pathname, { replace: true })
      // Clear success message sau 5 giây
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [location.state, navigate, location.pathname])

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    // Registration specific validations
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = "Họ và tên là bắt buộc"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }

    // Real-time validation for confirm password
    if (name === "confirmPassword" && !isLogin) {
      if (value && value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Mật khẩu xác nhận không khớp"
        }))
      } else if (value && value === formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ""
        }))
      }
    }

    // Real-time validation for password length
    if (name === "password") {
      if (value && value.length < 6) {
        setErrors(prev => ({
          ...prev,
          password: "Mật khẩu phải có ít nhất 6 ký tự"
        }))
      } else if (value && value.length >= 6) {
        setErrors(prev => ({
          ...prev,
          password: ""
        }))
        // Also validate confirm password if it exists
        if (formData.confirmPassword && formData.confirmPassword !== value) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: "Mật khẩu xác nhận không khớp"
          }))
        } else if (formData.confirmPassword && formData.confirmPassword === value) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: ""
          }))
        }
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted, isLogin:", isLogin)
    console.log("Form data:", formData)
    
    setSubmitError("")
    setSuccessMessage("")
    
    if (!validateForm()) {
      console.log("Validation failed")
      return
    }

    setIsLoading(true)

    if (isLogin) {
      console.log("Login data:", { email: formData.email, password: formData.password })
      try {
        const response = await AuthenService.login({ 
          email: formData.email, 
          password: formData.password 
        })
        console.log("Login response:", response)
        
        if (response.success) {
          // Đăng nhập thành công
          toast.success("Đăng nhập thành công!")
          // TODO: Lưu token, chuyển đến dashboard
          console.log("Login successful, user:", response.data.user)
        } else {
          // Kiểm tra nếu cần xác thực OTP
          if (response.requireOTP) {
            navigate("/otpverification", { 
              state: { 
                email: response.email,
                message: response.message 
              } 
            })
          } else {
            toast.error(response.message)
          }
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.")
        console.error("Login error:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      console.log("Attempting registration...")
      try {
        const response = await AuthenService.registerUser(formData)
        console.log("Registration response:", response)
        if (response.success) {
          navigate("/otpverification", { state: { email: formData.email } })
        } else {
          toast.error(response.message)
          console.error("Registration error:", response.message)
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.")
        console.error("Registration error:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleGoogleAuth = () => {
    console.log(`${isLogin ? 'Login' : 'Registration'} with Google`)
  }

  const toggleMode = () => {
    const newMode = !isLogin
    setIsLogin(newMode)

    // Navigate to appropriate URL
    if (newMode) {
      navigate("/login")
    } else {
      navigate("/registration")
    }

    // Reset form data and validation state when switching modes
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    })
    setErrors({})
    setSubmitError("")
    setSuccessMessage("")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 animate-fadeIn transition-all duration-500">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse animate-float"></div>
        <div
          className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-15 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-25 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-white opacity-20 rotate-45 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-6 h-6 bg-pink-200 opacity-30 rounded-full animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/6 w-3 h-3 bg-purple-200 opacity-25 animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-white opacity-15 rotate-12 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto">
          {/* Glass Morphism Container */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl animate-slideInUp glass-hover">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              {/* Logo */}
              <div className="flex justify-center mb-3 sm:mb-4 animate-bounceIn">
                <img
                  src="/images/socialconnect-high-resolution-logo-transparent.png"
                  alt="SocialConnect Logo"
                  className="h-6 sm:h-8 w-auto drop-shadow-lg hover:scale-110 transition-all duration-500 ease-out hover:-translate-y-1"
                />
              </div>

              {/* Animated Title */}
              <div className="title-container">
                <h1
                  className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg gradient-animate title-slide ${isLogin ? 'title-slide-in' : 'title-slide-out-up'
                    }`}
                >
                  Đăng Nhập
                </h1>
                <h1
                  className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg gradient-animate title-slide ${!isLogin ? 'title-slide-in' : 'title-slide-out-down'
                    }`}
                >
                  Tạo Tài Khoản
                </h1>
              </div>

              <p className="text-white/80 mt-2 sm:mt-3 animate-slideInUp transition-all duration-700 text-sm sm:text-base">
                {isLogin ? 'Đăng nhập vào tài khoản của bạn' : 'Tham gia cùng chúng tôi ngay hôm nay'}
              </p>
            </div>

            {/* Form Container with Smooth Transitions */}
            <div className="relative overflow-hidden transition-all duration-300">
              {/* Login Form */}
              <form
                onSubmit={handleSubmit}
                className={`space-y-4 sm:space-y-6 form-transition ${isLogin ? 'form-slide-in' : 'form-slide-out absolute top-0 left-0 right-0'
                  }`}
              >
                {/* Email Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-white/90">
                    Địa Chỉ Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent input-focus hover:scale-[1.02] hover:-translate-y-1 transform-gpu hover:shadow-lg text-sm sm:text-base"
                    placeholder="Nhập email của bạn"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white/90">
                    Mật Khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-sm bg-white/10 border text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent input-focus hover:scale-[1.02] hover:-translate-y-1 transform-gpu hover:shadow-lg text-sm sm:text-base ${
                      formData.password.length > 0 
                        ? formData.password.length >= 6 
                          ? 'border-green-400/50' 
                          : 'border-red-400/50'
                        : 'border-white/20'
                    }`}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <a href="#" className="text-xs sm:text-sm text-pink-300 hover:text-pink-200 transition-colors duration-300">
                    Quên mật khẩu?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 sm:py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-pink-400/50 animate-glow hover:animate-pulse btn-pulse text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="liquid-loader liquid-loader-lg"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    'Đăng Nhập'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-4 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-4 bg-transparent text-white/70">hoặc tiếp tục với</span>
                  </div>
                </div>

                {/* Google Auth Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-2.5 sm:py-3 px-6 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-white/30 flex items-center justify-center gap-3 hover:shadow-lg text-sm sm:text-base"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Đăng nhập bằng Google
                </button>
              </form>

              {/* Registration Form */}
              <form
                onSubmit={handleSubmit}
                className={`space-y-4 sm:space-y-6 form-transition ${!isLogin ? 'form-slide-in' : 'form-slide-out-left absolute top-0 left-0 right-0'
                  }`}
              >
                {/* Full Name Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-white/90">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent input-focus hover:scale-[1.02] hover:-translate-y-1 transform-gpu hover:shadow-lg text-sm sm:text-base"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="regEmail" className="block text-sm font-medium text-white/90">
                    Địa Chỉ Email
                  </label>
                  <input
                    type="email"
                    id="regEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent input-focus hover:scale-[1.02] hover:-translate-y-1 transform-gpu hover:shadow-lg text-sm sm:text-base"
                    placeholder="Nhập email của bạn"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="regPassword" className="block text-sm font-medium text-white/90">
                    Mật Khẩu
                  </label>
                  <input
                    type="password"
                    id="regPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-sm bg-white/10 border text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent input-focus hover:scale-[1.02] hover:-translate-y-1 transform-gpu hover:shadow-lg text-sm sm:text-base ${
                      formData.password.length > 0 
                        ? formData.password.length >= 6 
                          ? 'border-green-400/50' 
                          : 'border-red-400/50'
                        : 'border-white/20'
                    }`}
                    placeholder="Tạo mật khẩu"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                    Xác Nhận Mật Khẩu
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-sm bg-white/10 border text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent input-focus hover:scale-[1.02] hover:-translate-y-1 transform-gpu hover:shadow-lg text-sm sm:text-base ${
                      formData.confirmPassword.length > 0 
                        ? formData.password === formData.confirmPassword 
                          ? 'border-green-400/50' 
                          : 'border-red-400/50'
                        : 'border-white/20'
                    }`}
                    placeholder="Xác nhận mật khẩu của bạn"
                    required
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-3 animate-fadeIn">
                    <p className="text-green-400 text-sm">{successMessage}</p>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                )}

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 sm:py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-pink-400/50 animate-glow hover:animate-pulse btn-pulse text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="liquid-loader liquid-loader-lg"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    'Tạo Tài Khoản'
                  )}
                </button>
              </form>
            </div>

            {/* Toggle Mode Link */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-white/70 text-sm sm:text-base">
                {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{" "}
                <button
                  onClick={toggleMode}
                  className="text-pink-300 hover:text-pink-200 font-medium transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1 transform-gpu hover:shadow-lg"
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
