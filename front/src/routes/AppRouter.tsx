import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import Layout from '../components/Layout/Layout';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: string[];
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const { user, hasRole } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.some(role => hasRole(role))) return <Navigate to="/" />;
  
  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="users" element={
            <PrivateRoute roles={['admin']}>
              <UsersPage />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;