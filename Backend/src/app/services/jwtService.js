const jwt = require('jsonwebtoken');

class JWTService {
    // Tạo access token
    generateAccessToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
        );
    }

    // Tạo refresh token
    generateRefreshToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
        );
    }

    // Tạo cả 2 token
    generateTokens(payload) {
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
        
        return {
            accessToken,
            refreshToken
        };
    }

    // Verify access token
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    // Verify refresh token
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    // Extract token from Authorization header
    extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }

    // Decode token without verification (để lấy payload khi token hết hạn)
    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            return null;
        }
    }
}

module.exports = new JWTService();
