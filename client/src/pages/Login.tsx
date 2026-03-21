/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Divider,
  Stack,
  IconButton,
  InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import { INVALID_LOGIN_ERRORS } from '../constants/errors';
import { useAuth } from '../contexts/AuthContext';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { loginUser, googleSignIn } from '../services/userService';

const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrorMsg('');

    if (!email || !password) {
      setLoginErrorMsg(INVALID_LOGIN_ERRORS.EMPTY_CREDENTIALS);
      return;
    }

    try {
      setIsLoading(true);

      // Pass the user credentials.
      const response: any = await loginUser({ email, password } as any);

      const user = response.user || response;
      const token = response.accessToken || "temp-token";

      // console.log(`user: `, user);
      login(user, token, response?.refreshToken); // Update context

      // Navigate to home
      navigate('/');

    } catch (error: any) {
      console.error("Login Error:", error);
      setLoginErrorMsg(error.response?.data?.message || INVALID_LOGIN_ERRORS.INVALID_CREDENTIALS);
    } finally {
      setIsLoading(false);
    }
  };


  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      const response: any = await googleSignIn(credentialResponse);

      const { accessToken, refreshToken, ...user } = response;

      login(user, accessToken, refreshToken);

      navigate('/');
    } catch (error: any) {
      setLoginErrorMsg("Google Sign-In failed on the server.");
    } finally {
      setIsLoading(false);
    }
  }

  const onGoogleLoginFailiure = () => {
    console.log("google login failed");
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 4,
          border: 'none',
          backgroundColor: '#fdfbf7',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontFamily: 'serif', fontWeight: 'bold', mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue sharing your restaurant experiences
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField
              label="Email Address"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />


            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                bgcolor: '#004d40',
                borderRadius: 8,
                py: 1.8,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#00332c' }
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {
              (loginErrorMsg != '') &&
              <Typography variant="body1" color="error" sx={{ alignSelf: 'center', fontWeight: 'bold', direction: 'rtl' }}>
                {loginErrorMsg}
              </Typography>
            }
          </Stack>
        </form>

        <Box sx={{ my: 3 }}>
          <Divider>
            <Typography variant="caption" color="text.secondary">
              OR CONTINUE WITH
            </Typography>
          </Divider>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailiure} />
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Box component="span" sx={{ color: '#004d40', fontWeight: 'bold', textDecoration: 'underline' }}>
                Register here
              </Box>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container >
  );
};

export default Login;