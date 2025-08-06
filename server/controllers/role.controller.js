const Role = require('../models/Role');

/**
 * @api {post} /api/roles Create new role
 * @apiName CreateRole
 * @apiGroup Role
 * @apiParam {String} name Name of the role
 * @apiParam {String[]} permissions Array of permissions (read, write, delete, all)
 * @apiParam {String} [description] Description of the role
 * @apiSuccess {Object} role Role object
 * @apiError {String} Invalid permissions
 * @apiError {String} Role already exists
 * @apiError {String} Server error when creating role
 */
exports.createRole = async (req, res) => {
  try {
    const { name, permissions, description } = req.body;

    const allowedPermissions = ['read', 'write', 'delete', 'all'];
    if (!permissions.every(permission => allowedPermissions.includes(permission))) {
      return res.status(400).json({ msg: 'Invalid permissions' });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ msg: 'Role already exists' });
    }

    // Create and save new role
    const role = new Role({
      name,
      permissions,
      description
    });

    await role.save();

    res.status(201).json(role);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error when creating role');
  }
};


/**
 * Updates an existing role by its ID.
 * 
 * @param {Object} req - Express request object containing role ID in params and role details in body.
 * @param {Object} res - Express response object used to send the HTTP response.
 * 
 * @returns {void}
 * 
 * @description Retrieves a role by its ID and updates its name, permissions, and description with the data
 * provided in the request body. If the role is not found, responds with a 404 status and an appropriate 
 * message. If the update is successful, responds with the updated role and a success message. Handles any 
 * errors by logging them and responding with a 500 status.
 */

exports.updateRole = async (req, res) => {
  try {
    const { name, permissions, description } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, msg: 'Role not found' });
    }
    role.name = name;
    role.permissions = permissions;
    role.description = description;
    await role.save();
    res.status(200).json({success: true, role});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error when updating role');
  }
};


/**
 * Deletes an existing role by its ID.
 * 
 * @param {Object} req - Express request object containing role ID in params.
 * @param {Object} res - Express response object used to send the HTTP response.
 * 
 * @returns {void}
 * 
 * @description Finds and deletes a role by its ID. If the role is not found,
 * responds with a 404 status and an appropriate message. If the role is deleted
 * successfully, responds with a success message. Handles any errors by logging 
 * them and responding with a 500 status.
 */

exports.deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
        return res.status(404).json({ success: false, msg: 'Role not found' });
    }
    res.json({ success: true, msg: 'Role removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error when deleting role');
  }
};

/**
 * @api {get} /api/roles Get all roles
 * @apiName GetAllRoles
 * @apiGroup Role
 * @apiSuccess {Boolean} success true
 * @apiSuccess {Object[]} roles Array of roles
 * @apiError {String} Server error when getting roles
 */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error when getting roles');
  }
};