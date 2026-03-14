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
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';
import { INVALID_LOGIN_ERRORS } from '../constants/errors';
import { useAuth } from '../contexts/AuthContext';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
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
      login(user, token); // Update context
      
      // Navigate to home
      navigate('/'); 

    } catch (error: any) {
      console.error("Login Error:", error);
      setLoginErrorMsg(error.response?.data?.message || INVALID_LOGIN_ERRORS.INVALID_CREDENTIALS);
    } finally {
      setIsLoading(false);
    }
  };

  // const onGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
  //   console.log(credentialResponse);

  //   if (credentialResponse.credential) {
  //     // Decode the Google JWT to get the user's details
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const decodedToken: any = jwtDecode(credentialResponse.credential);
      
  //     // Map Google's data to match our User structure
  //     const googleUser = {
  //       _id: decodedToken.sub, // Google's unique identifier for the user
  //       username: decodedToken.name,
  //       email: decodedToken.email,
  //       provider: "google" as const,
  //       profileImage: decodedToken.picture // Get their actual Google pfp
  //     };

  //     // Update the AuthContext (This is updates the Navbar state)
  //     login(googleUser, credentialResponse.credential);

  //     localStorage.setItem('token', credentialResponse.credential);
  //     navigate('/');
  //   }
  // }

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);

      console.log(`credentials: `, credentialResponse);
      
      // Send Google's response to your backend
      const response: any = await googleSignIn(credentialResponse);

      // console.log(`response: `, response);

      if (credentialResponse.credential) {
        // Decode the Google JWT to get the user's details
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken: any = jwtDecode(credentialResponse.credential);
        
        // Map Google's data to match our User structure
        const user = {
          _id: decodedToken.sub, // Google's unique identifier for the user
          username: decodedToken.name,
          email: decodedToken.email,
          provider: "google" as const,
          profileImage: decodedToken.picture // Get their actual Google pfp
        };
    
        // const user = response.user || response;
        const token = response.accessToken || credentialResponse.credential; // Fallback to google token if backend doesn't send one

        login(user, token); // Update context
        navigate('/');
      }

    } catch (error: any) {
      console.error("Google Login Error:", error);
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
          p: 4, 
          borderRadius: 2, 
          border: '1px solid #e0e0e0',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' 
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
              disabled={isLoading}
              startIcon={<LoginIcon />}
              sx={{
                bgcolor: '#004d40',
                color: '#fff',
                borderRadius: '20px',
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { bgcolor: '#00382e' },
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
    </Container>
  );
};

export default Login;