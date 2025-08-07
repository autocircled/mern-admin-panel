import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authService = {
  /**
   * Login user
   * @param {Object} credentials - username and password
   * @returns {Promise} Promise with token and user data
   */
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { msg: 'An unknown error occurred' };
    }
  },

  /**
   * Get current user data
   * @param {string} token - JWT token
   * @returns {Promise} Promise with user data
   */
  async getMe(token) {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { msg: 'Failed to fetch user data' };
      }
      throw new Error('Failed to fetch user data');
    }
  },

  /**
   * Logout user (client-side only)
   */
  logout() {
    // This is client-side only since JWT is stateless
    // For server-side, you'd need to implement a token blacklist
  }
};

export default authService;