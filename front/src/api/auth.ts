import axios from 'axios';
import type { User } from '../types';

const API_URL = 'http://localhost:5000/api';

// Type definitions for auth responses
interface LoginResponse {
  token: string;
  user: User;
}

interface ErrorResponse {
  msg: string;
  errors?: Array<{ msg: string }>;
}

// Auth API service
const authService = {
  /**
   * Login user
   * @param credentials - username and password
   * @returns Promise with token and user data
   */
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { msg: 'An unknown error occurred' } as ErrorResponse;
    }
  },

  /**
   * Get current user data
   * @param token - JWT token
   * @returns Promise with user data
   */
  async getMe(token: string): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_URL}/auth/me`, {
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
  logout(): void {
    // This is client-side only since JWT is stateless
    // For server-side, you'd need to implement a token blacklist
  }
};

export default authService;