const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateLogin } = require('../middleware/validation');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, authController.login);

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', authController.getMe);

module.exports = router;