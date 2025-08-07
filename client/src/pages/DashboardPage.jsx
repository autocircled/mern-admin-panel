import { Card } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { user, logout, hasRole, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // Or redirect to login
  }

  return (
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
    // <Container maxWidth="lg">
    //   <Box sx={{ my: 4 }}>
    //     <Typography variant="h3" component="h1" gutterBottom>
    //       Dashboard
    //     </Typography>
        
    //     <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
    //       <Typography variant="h5" gutterBottom>
    //         Welcome, {user.username}!
    //       </Typography>
    //       <Typography sx={{
    //         marginBottom: "16px"
    //       }}>
    //         Email: {user.email}
    //       </Typography>
    //       <Typography sx={{
    //         marginBottom: "16px"
    //       }}>
    //         Roles: {user.roles.map(role => role.name).join(', ')}
    //       </Typography>
    //     </Paper>

    //     <Box sx={{ display: 'flex', gap: 2 }}>
    //       {hasPermission('manage_users') && (
    //         <Button 
    //           variant="contained" 
    //           onClick={() => navigate('/users')}
    //         >
    //           Manage Users
    //         </Button>
    //       )}
          
    //       {hasRole('admin') && (
    //         <Button 
    //           variant="contained" 
    //           onClick={() => navigate('/roles')}
    //         >
    //           Roles
    //         </Button>
    //       )}
          
    //       <Button 
    //         variant="outlined" 
    //         color="error"
    //         onClick={logout}
    //       >
    //         Logout
    //       </Button>
    //     </Box>
    //   </Box>
    // </Container>
  );
};

export default DashboardPage;