import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Box, TextField, Button, Typography, Paper, Container } from '@mui/material';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        // console.log(credentials);
        await login(credentials);
        navigate('/');
    } catch (err) {
        const error = err as { msg?: string };
        setError(error.msg || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        
        {error && (
          <Typography color="error" paragraph align="center">
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;