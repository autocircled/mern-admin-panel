const { check, validationResult } = require('express-validator');

const validateLogin = [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateRegister = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').exists(),
  check('password', 'Password must be 8+ characters').isLength({ min: 8 }),
  check('roles', 'At least one role is required').isArray({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateUserUpdate = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  check('roles', 'At least one role is required').isArray({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateRole = [
  check('name', 'Role name is required').not().isEmpty(),
  check('permissions', 'At least one permission is required').isArray({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateLogin,
  validateRegister,
  validateUserUpdate,
  validateRole
};