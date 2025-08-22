const express = require('express')
const router = express.Router();
const authenController = require('../app/controllers/authenController')

router.post('/register', authenController.registerUser);
router.post('/verify-otp', authenController.verifyOTP);
router.post('/resend-otp', authenController.resendOTP); 
router.post('/login', authenController.login);

module.exports = router;