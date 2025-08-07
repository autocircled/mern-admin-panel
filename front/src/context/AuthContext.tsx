import React, { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
import authService from '../api/auth';
import type { AuthContextType, User } from '../types';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getMe(token);
          setUser(userData);
        } catch (err) {
          const error = err as Error;
          console.error(error.message);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (credentials: { username: string; password: string }) => {
    const { token, user } = await authService.login(credentials);
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some(r => r.name === role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.permissions.includes(permission) || 
      role.permissions.includes('all')
    );
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        loading,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };