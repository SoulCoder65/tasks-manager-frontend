import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { signup } from '../../store/slices/authSlice';
import ErrorNotification from '../../components/ErrorNotification';
import Loader from '../../components/Loader';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiError = useSelector((state) => state.auth.error);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasUpperCase.test(password) &&
      hasLowerCase.test(password)
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate fields
    if (!firstName) newErrors.firstName = 'First name is required.';
    if (!lastName) newErrors.lastName = 'Last name is required.';
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format.';
    }    if (!password) newErrors.password = 'Password is required.';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required.';
    if (password && !validatePassword(password)) newErrors.password = 'Password must be at least 8 characters long, include a number, an uppercase letter, and a lowercase letter.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await dispatch(signup({firstName, lastName, email, password}));
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/dashboard');
      }
    } catch (error) {
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        width: '500px',
        mx: 'auto',
        mt: 2,
        p: 3,
        borderRadius: '4px',
        textAlign: 'center',
      }}
    >
      <Typography
        variant=""
        component="h1"
        gutterBottom
        color='#1976d2'
        align='left'
      >
        Sign up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSignup}
        sx={{
          width: '500px',
          mx: 'auto',
          mt: 1,
          p: 3,
          border: '2px solid #1976d2',
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        <ErrorNotification error={apiError} />
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setFirstName(e.target.value)}
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setLastName(e.target.value)}
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, bgcolor: '#1976d2' }}
        >
          Signup
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ color: '#1976d2' }}
          >
            Login
          </Link>
        </Typography>
        {/* <Button
          variant="contained"
          bgcolor="#1976d2"
          sx={{
            mt: 2,
            width: '45%',
            mx: 'auto',
            display: 'block',
          }}
        >
          Signup with <b>Google</b>
        </Button> */}
      </Box>
    </Box>
  );
};

export default Signup;
