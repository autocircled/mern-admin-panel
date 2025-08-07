// User type
export interface User {
  _id: string;
  username: string;
  email: string;
  roles: Role[];
  createdAt: string;
}

// Role type
export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  description?: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}