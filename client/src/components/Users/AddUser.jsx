import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import usersApi from '../../api/users';
import rolesApi from '../../api/roles';

const AddUser = () => {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: []
  });

  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) return;
      
      try {
        const res = await rolesApi.getAllRoles(token);
        setRoles(res.data);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };
    fetchRoles();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      await usersApi.createUserWithRoles(formData, token);
      alert('User created successfully!');
      setFormData({
        username: '',
        email: '',
        password: '',
        roles: []
      });
    } catch (err) {
      console.error('Failed to create user:', err);
      alert('Failed to create user. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleToggle = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
        minLength={8}
      />
      
      <div>
        <h4>Select Roles:</h4>
        {roles.map(role => (
          <div key={role._id}>
            <input
              type="checkbox"
              id={role._id}
              checked={formData.roles.includes(role._id)}
              onChange={() => handleRoleToggle(role._id)}
            />
            <label htmlFor={role._id}>
              {role.name} ({role.permissions.join(', ')})
            </label>
          </div>
        ))}
      </div>

      <button type="submit">Create User</button>
    </form>
  );
};

export default AddUser;