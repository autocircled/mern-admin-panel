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

// @route   POST /api/auth/first-admin
// @desc    Create first admin user (only works when no users exist)
// @access  Public
router.post('/first-admin', authController.firstAdmin);

module.exports = router;