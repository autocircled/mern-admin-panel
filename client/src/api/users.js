import axios from 'axios';
import API_CONFIG from '../api/constants';

const createUserWithRoles = async (userData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await axios.post(`${API_CONFIG.API_ENDPOINT}/api/users`, userData, config);
    return res.data;
  } catch (err) {
    if (err.response) {
      throw err.response.data;
    }
    throw { message: 'An unexpected error occurred' };
  }
};

const getAllUsers = async (token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await axios.get(`${API_CONFIG.API_ENDPOINT}/api/users`, config);
    return res.data;
  } catch (err) {
    if (err.response) {
      throw err.response.data;
    }
    throw { message: 'An unexpected error occurred' };
  }
}

export default {
  createUserWithRoles,
  getAllUsers
};