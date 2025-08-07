import axios from 'axios';

const createUserWithRoles = async (userData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await axios.post('/api/users', userData, config);
    return res.data;
  } catch (err) {
    if (err.response) {
      throw err.response.data;
    }
    throw { message: 'An unexpected error occurred' };
  }
};

export default {
  createUserWithRoles
};