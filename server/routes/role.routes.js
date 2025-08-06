const express = require('express');
const router = express.Router();
const { validateRole } = require('../middleware/validation');
const roleController = require('../controllers/role.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// @route   POST /api/roles
// @desc    Create new role with permissions
// @access  Private/Admin
router.post( '/', auth, role('admin'), validateRole, roleController.createRole );

// @route   PUT /api/roles/:id
// @desc    Update existing role with permissions
// @access  Private/Admin
router.put( '/:id', auth, role('admin'), validateRole, roleController.updateRole );

// @route   DELETE /api/roles/:id
// @desc    Delete existing role
// @access  Private/Admin
router.delete( '/:id', auth, role('admin'), roleController.deleteRole );

// @route   GET /api/roles
// @desc    Get all roles
// @access  Private/Admin
router.get('/', [auth, role('admin')], roleController.getAllRoles);

module.exports = router;