import axios from 'axios';

const createRole = async (roleData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await axios.post('/api/roles', roleData, config);
    return res.data;
  } catch (err) {
    if (err.response) {
      throw err.response.data;
    }
    throw { message: 'An unexpected error occurred' };
  }
};

const getAllRoles = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await axios.get('/api/roles', config);
    return res.data;
  } catch (err) {
    if (err.response) {
      throw err.response.data;
    }
    throw { message: 'An unexpected error occurred' };
  }
};

export default {
  createRole,
  getAllRoles
};