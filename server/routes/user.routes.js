const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validateRegister, validateUserUpdate } = require('../middleware/validation');

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', auth, role('admin'), userController.getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', auth, role('admin'), userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/:id', auth, role('admin'), validateUserUpdate, userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', auth, role('admin'), userController.deleteUser);

// @route   POST /api/users
// @desc    Create new user with role and permissions
// @access  Private/Admin
router.post('/', auth, role('admin'), validateRegister, userController.createUser);

module.exports = router;