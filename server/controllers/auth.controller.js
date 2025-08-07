const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

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
    res.status(500).send('Server error get user details');
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

const firstAdmin = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ msg: 'Admin user already exists' });
    }

    // Find or create admin role
    let adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      adminRole = new Role({ name: 'admin', permissions: ['all'] });
      await adminRole.save();
    }

    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: '123456',
      roles: [adminRole._id]
    });

    await adminUser.save();
    
    res.json({ msg: 'First admin user created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  login,
  getMe,
  firstAdmin
};