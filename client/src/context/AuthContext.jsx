import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../api/auth';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getMe(token);
          setUser(userData);
        } catch (err) {
          console.error(err.message);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
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

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.some(r => r.name === role);
  };

  const hasPermission = (permission) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.permissions.includes(permission) || 
      role.permissions.includes('all')
    );
  };

  const hasRequiredRole = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some(role => hasRole(role));
  };

  const hasRequiredPermission = (requiredPermissions) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.some(perm => hasPermission(perm));
  };

  const shouldDisplayItem = (item) => {
    const hasRole = hasRequiredRole(item.roles);
    const hasPerm = hasRequiredPermission(item.permissions);
    if (!item.roles && !item.permissions) return true;
    return hasRole || hasPerm;
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
        hasPermission,
        shouldDisplayItem
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};