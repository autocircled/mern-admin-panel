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

module.exports = {
  validateLogin
};