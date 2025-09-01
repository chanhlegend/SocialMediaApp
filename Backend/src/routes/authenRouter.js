const express = require('express')
const router = express.Router();
const authenController = require('../app/controllers/authenController')
const authMiddleware = require('../app/middlewares/auth');

// Public routes (không cần authentication)
router.post('/register', authenController.registerUser);
router.post('/verify-otp', authenController.verifyOTP);
router.post('/resend-otp', authenController.resendOTP); 
router.post('/login', authenController.login);
router.post('/refresh-token', authenController.refreshToken);

// Protected routes (cần authentication)
router.post('/logout', authMiddleware.requireAuth, authenController.logout);
router.get('/profile', authMiddleware.requireAuth, authenController.getProfile);
router.get('/verify-token', authMiddleware.requireAuth, authenController.verifyToken);

module.exports = router;