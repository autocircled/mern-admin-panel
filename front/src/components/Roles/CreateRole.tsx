import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import rolesApi from '../../api/roles';

// Type definitions
interface RoleFormData {
  name: string;
  permissions: string[];
  description: string;
}

// Available permissions for selection
const PERMISSIONS = [
  'read',
  'write',
  'delete',
  'manage_users',
  'manage_roles',
  'manage_content',
  'view_dashboard'
] as const;

type Permission = typeof PERMISSIONS[number];

const CreateRole = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    permissions: [],
    description: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      await rolesApi.createRole(formData, token);
      setSuccess(true);
      setError(null);
      // Reset form
      setFormData({
        name: '',
        permissions: [],
        description: ''
      });
    } catch (err) {
      console.error('Role creation failed:', err);
      setSuccess(false);
      setError(err.message || 'Failed to create role');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionToggle = (permission: Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="role-form">
      <h2>Create New Role</h2>
      {success && <div className="alert alert-success">Role created successfully!</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Role Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Permissions</label>
          <div className="permissions-grid">
            {PERMISSIONS.map(permission => (
              <div key={permission} className="permission-item">
                <input
                  type="checkbox"
                  id={`perm-${permission}`}
                  checked={formData.permissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                />
                <label htmlFor={`perm-${permission}`}>
                  {permission.replace(/_/g, ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Role
        </button>
      </form>

      <style jsx>{`
        .role-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .permission-item {
          display: flex;
          align-items: center;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        .permission-item input {
          margin-right: 8px;
        }
        .alert {
          padding: 10px 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .alert-success {
          background-color: #d4edda;
          color: #155724;
        }
        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default CreateRole;