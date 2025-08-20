const express = require('express')
const router = express.Router();
const userController = require('../app/controllers/userController')

router.get('/', userController.getAllUsers);

module.exports = router;