import axios, { AxiosError, type AxiosResponse } from 'axios';

interface UserData {
  username: string;
  email: string;
  password: string;
  roles: string[];
  // Add other user properties as needed
}

interface ApiResponse {
  // Define the structure of your successful response
  id: string;
  username: string;
  email: string;
  roles: string[];
  // Add other response properties as needed
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  // Add other error properties as needed
}

const createUserWithRoles = async (userData: UserData, token: string): Promise<ApiResponse> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res: AxiosResponse<ApiResponse> = await axios.post('/api/users', userData, config);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response) {
      throw error.response.data;
    }
    throw { message: 'An unexpected error occurred' };
  }
};

export default {
  createUserWithRoles
};