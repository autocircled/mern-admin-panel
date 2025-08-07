import { Card } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main';

const DashboardPage = () => {
  const { user, logout, hasRole, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <MainLayout>
      <div className='w-full p-2 md:p-4'>
        <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>

        <Card className="mb-4 p-4">
          <h2 className="text-lg font-semibold mb-2">Welcome, {user.username}!</h2>
          <p className="mb-2">Email: {user.email}</p>
          <p className="mb-2">Roles: {user.roles.map(role => role.name).join(', ')}</p>
        </Card>

        <Card className="mb-4 p-4">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <div className='flex gap-2'>
            {hasPermission('manage_users') && (
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/users')}
              >
                Manage Users
              </Button>
            )}
            {hasRole('admin') && (        
              <Button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/roles')}
              >
                Roles
              </Button>
            )}
            <Button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </Card>

      </div>
    </MainLayout>
  );
};

export default DashboardPage;