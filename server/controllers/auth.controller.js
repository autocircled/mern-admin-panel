const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).populate('roles');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      id: user._id,
      username: user.username,
      roles: user.roles.map(role => role.name)
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('roles');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  login,
  getMe
};