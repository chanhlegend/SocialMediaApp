import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { ROUTE_PATH } from "../constants/routePath";
import "../../public/css/AuthPage.css"

import { AuthenService } from "../services/AuthenService";

export default function OTPVerification() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email
    const loginMessage = location.state?.message
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60)
    const inputRefs = useRef([])

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft])

    // Hiển thị message từ login nếu có
    useEffect(() => {
        if (loginMessage) {
            toast.info(loginMessage)
        }
    }, [loginMessage])

    const handleChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerify = async () => {
        setIsLoading(true)
        const response = await AuthenService.verifyOTP({ email, otp: otp.join("") })
        if (response.success) {
            setIsLoading(false)
            toast.success("Xác thực thành công!")
            navigate(ROUTE_PATH.LOGIN, { 
                state: { 
                    successMessage: "Xác thực thành công, vui lòng đăng nhập!" 
                } 
            })
        } else {
            setIsLoading(false)
            toast.error(response.message || "Mã OTP không đúng hoặc đã hết hạn")
        }
    }

    const handleResend = async() => {
        setIsResending(true)
        setTimeLeft(60)
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
        const response = await AuthenService.resendOTP({ email })
        if (response.success) {
            toast.success("Mã OTP đã được gửi lại!")
        } else {
            toast.error(response.message || "Không thể gửi lại mã OTP")
        }
        setIsResending(false)
    }

    const handleBackButton = () => {
        navigate(ROUTE_PATH.REGISTRATION)
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-purple-400/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl animate-pulse delay-3000"></div>
            </div>

            {/* Floating Geometric Shapes */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rotate-45 animate-bounce delay-500"></div>
                <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-300/30 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-pink-300/40 rotate-45 animate-bounce delay-1500"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    {/* Glass Morphism Container */}
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Xác Thực Email</h1>
                            <p className="text-white/70 text-sm">
                                Chúng tôi đã gửi mã xác thực 6 chữ số đến
                                <br />
                                <span className="text-purple-300 font-medium">{email}</span>
                            </p>
                        </div>

                        {/* OTP Input Fields */}
                        <div className="mb-6">
                            <div className="flex justify-center space-x-3 mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                                        placeholder="0"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            disabled={isLoading || otp.some((digit) => !digit)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="liquid-loader liquid-loader-lg mr-3"></div>
                                    Đang xác thực...
                                </div>
                            ) : (
                                "Xác Thực Mã"
                            )}
                        </button>

                        {/* Resend Code */}
                        <div className="text-center mt-6">
                            {timeLeft > 0 ? (
                                <p className="text-white/70 text-sm">
                                    Gửi lại mã sau <span className="text-purple-300 font-medium">{timeLeft}s</span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                                >
                                    {isResending ? (
                                        <>
                                            <div className="liquid-loader mr-2"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        "Gửi lại mã xác thực"
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Back to Registration */}
                        <div className="text-center mt-6 pt-6 border-t border-white/10">
                            <button className="text-white/70 hover:text-white text-sm transition-colors duration-300 flex items-center justify-center mx-auto"
                            onClick={handleBackButton}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Quay Lại Đăng Ký
                            </button>
                        </div>
                    </div>

                    {/* Footer Text */}
                    <p className="text-center text-white/50 text-xs mt-6">
                        Không nhận được mã? Kiểm tra thư rác hoặc liên hệ hỗ trợ.
                    </p>
                </div>
            </div>
        </div>
    )
}
