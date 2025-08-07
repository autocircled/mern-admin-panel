import { useAuth } from '../context/AuthContext';
import { Box, Typography, Paper, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout, hasRole, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Welcome, {user.username}!
          </Typography>
          <Typography sx={{
            marginBottom: "16px"
          }}>
            Email: {user.email}
          </Typography>
          <Typography sx={{
            marginBottom: "16px"
          }}>
            Roles: {user.roles.map(role => role.name).join(', ')}
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {hasPermission('manage_users') && (
            <Button 
              variant="contained" 
              onClick={() => navigate('/users')}
            >
              Manage Users
            </Button>
          )}
          
          {hasRole('admin') && (
            <Button 
              variant="contained" 
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </Button>
          )}
          
          <Button 
            variant="outlined" 
            color="error"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;