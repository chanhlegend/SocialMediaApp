const jwtService = require('../services/jwtService');
const User = require('../models/user.model');

class AuthMiddleware {
    // Middleware bắt buộc phải đăng nhập
    async requireAuth(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const token = jwtService.extractTokenFromHeader(authHeader);

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token is required'
                });
            }

            // Verify token
            const decoded = jwtService.verifyAccessToken(token);
            
            // Lấy thông tin user từ database
            const user = await User.findById(decoded.userId).select('-password -otp -otpExpires');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (user.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    message: 'Account is not active'
                });
            }

            // Attach user to request object
            req.user = user;
            next();

        } catch (error) {
            if (error.message === 'Invalid access token') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired access token'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Authentication error',
                error: error.message
            });
        }
    }

    // Middleware tùy chọn - không bắt buộc đăng nhập
    async optionalAuth(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const token = jwtService.extractTokenFromHeader(authHeader);

            if (token) {
                try {
                    const decoded = jwtService.verifyAccessToken(token);
                    const user = await User.findById(decoded.userId).select('-password -otp -otpExpires');
                    
                    if (user && user.status === 'active') {
                        req.user = user;
                    }
                } catch (error) {
                    // Ignore token errors for optional auth
                    console.log('Optional auth token error:', error.message);
                }
            }

            next();

        } catch (error) {
            // Continue without authentication for optional auth
            next();
        }
    }

    // Middleware kiểm tra role admin
    async requireAdmin(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin role required'
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Authorization error',
                error: error.message
            });
        }
    }
}

module.exports = new AuthMiddleware();
