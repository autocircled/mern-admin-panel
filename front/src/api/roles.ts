import axios, { AxiosError, type AxiosResponse } from 'axios';

// Type definitions
interface Role {
  _id: string;
  name: string;
  permissions: string[];
  // Add other role properties as needed
}

interface RoleData {
  name: string;
  permissions: string[];
  // Add other creation properties as needed
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  // Add other error properties as needed
}

// API functions
const createRole = async (roleData: RoleData, token: string): Promise<Role> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res: AxiosResponse<Role> = await axios.post('/api/roles', roleData, config);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response) {
      throw error.response.data;
    }
    throw { message: 'An unexpected error occurred' };
  }
};

const getAllRoles = async (token: string): Promise<Role[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res: AxiosResponse<Role[]> = await axios.get('/api/roles', config);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response) {
      throw error.response.data;
    }
    throw { message: 'An unexpected error occurred' };
  }
};

// Export the API service
const rolesApi = {
  createRole,
  getAllRoles
};

export default rolesApi;