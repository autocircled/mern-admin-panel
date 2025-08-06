const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  permissions: {
    type: [String],
    required: true,
    default: ['read']
  },

  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent deletion of default roles
RoleSchema.pre('remove', async function(next) {
  const DEFAULT_ROLES = ['admin', 'user'];
  if (DEFAULT_ROLES.includes(this.name)) {
    throw new Error(`Cannot delete default role: ${this.name}`);
  }
  next();
});

module.exports = mongoose.model('Role', RoleSchema);