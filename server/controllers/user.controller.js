const Role = require('../models/Role');
const User = require('../models/User');

/**
 * @api {get} /api/users Get all users
 * @apiName GetAllUsers
 * @apiGroup User
 * @apiSuccess {Boolean} success true
 * @apiSuccess {Object[]} users Array of user objects without passwords
 * @apiError {String} Server error when getting users
 */

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('roles');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error when getting users');
  }
};

/**
 * @api {get} /api/users/:id Get user by ID
 * @apiName GetUser
 * @apiGroup User
 * @apiParam {String} id User ID
 * @apiSuccess {Object} user User data
 * @apiError {String} Server error when getting user
 * @apiError {String} User not found
 */

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
    res.status(500).send('Server error when getting user');
  }
};

/**
 * Updates an existing user by its ID.
 * 
 * @param {Object} req - Express request object containing user ID in params and user details in body.
 * @param {Object} res - Express response object used to send the HTTP response.
 * 
 * @returns {void}
 * 
 * @description Retrieves a user by its ID and updates its username, email, and roles with the data
 * provided in the request body. If the user is not found, responds with a 404 status and an appropriate 
 * message. If the update is successful, responds with the updated user and a success message. Handles any 
 * errors by logging them and responding with a 500 status.
 */
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
    res.status(500).send('Server error when updating user');
  }
};

/**
 * @api {delete} /api/users/:id Delete user by ID
 * @apiName DeleteUser
 * @apiGroup User
 * @apiParam {String} id User ID
 * @apiSuccess {Boolean} success true
 * @apiSuccess {String} msg User removed
 * @apiError {String} Server error when deleting user
 * @apiError {String} User not found
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error when deleting user');
  }
};

/**
 * @api {post} /api/users Create new user with role and permissions
 * @apiName CreateUser
 * @apiGroup User
 * @apiParam {String} username Username of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 * @apiParam {String[]} roles Array of role IDs to assign to the user
 * @apiSuccess {Object} user User object without password
 * @apiError {String} Server error when creating user
 * @apiError {String} One or more roles not found
 */
const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    

    // Check if roles exist
    const existingRoles = await Role.find({ _id: { $in: roles } });
    if (existingRoles.length !== roles?.length) {
      return res.status(400).json({ msg: 'One or more roles not found' });
    }
    

    // Create user (password will be hashed by pre-save hook)
    const user = new User({
      username,
      email,
      password,
      roles: existingRoles.map(role => role._id),
    });
    
    await user.save();
    
    // Return user without password
    const userToReturn = await User.findById(user._id).select('-password').populate('roles');
    res.json(userToReturn);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error when creating user');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
};