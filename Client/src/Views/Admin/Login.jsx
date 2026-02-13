import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { login } from '../../store/redux/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../Assets/Constants/showNotifier';
import CustomTextField from '../../Components/Common/CustomTextField';
import ThemeButton from '../../Components/Common/ThemeButton';

export default function AdminLogin() {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) navigate('/admin/dashboard');
  }, [user, navigate]);

  const validateForm = () => {
    let valid = true;

    if (!email.includes('@') || email.trim() === '') {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const postLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const credentials = { email, password };

    try {
      await dispatch(login(credentials)).unwrap();
      showSuccess('Login Successful');
    } catch (err) {
      showError(err?.message || 'Login failed');
      console.error('Login error:', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: '2.5rem 2rem',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[8],
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          Admin Login
        </Typography>

        <CustomTextField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />

        <CustomTextField
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />

        <ThemeButton
          label="Login"
          onClick={postLogin}
          loading={loading}
          variant="primary"
          fullWidth
          sx={{ mt: 2 }}
        />
      </Paper>
    </Box>
  );
}
