import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
          
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                  <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <ProtectedRoute permissions={['manage_users']}>
                  <UsersPage />
              </ProtectedRoute>
            } 
            />
          <Route 
            path="/roles" 
            element={
              <ProtectedRoute permissions={['manage_users']}>
                  <RolesPage />
              </ProtectedRoute>
            } 
            />
        </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;