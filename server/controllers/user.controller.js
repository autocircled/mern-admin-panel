const Role = require('../models/Role');
const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('roles');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('roles');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};

const updateUser = async (req, res) => {
  const { username, email, roles } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    if (roles) user.roles = roles;

    await user.save();
    user = await User.findById(user._id).select('-password').populate('roles');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Check if roles exist
    const foundRoles = await Role.find({ _id: { $in: roles } });
    if (foundRoles.length !== roles.length) {
      return res.status(400).json({ msg: 'One or more roles not found' });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = new User({
      username,
      email,
      password,
      roles
    });

    await user.save();
    
    // Return user without password
    const userToReturn = await User.findById(user._id).select('-password').populate('roles');
    res.json(userToReturn);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
};