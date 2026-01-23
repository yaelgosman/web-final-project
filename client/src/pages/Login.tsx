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
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';
import { INVALID_LOGIN_ERRORS } from '../constants/errors';
import { useAuth } from '../contexts/AuthContext';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with:", { email, password });

    if (email === '' || password === '') {
      setLoginErrorMsg(INVALID_LOGIN_ERRORS.EMPTY_CREDENTIALS);
      return;
    }

    // TODO: add here the call to the Login request + Navigate to home page if valid!

    const mockupUserToValidate = { email: 'e@gmail.com', password: '123' };

    if ( email !== mockupUserToValidate.email || password !== mockupUserToValidate.password ) {
      setLoginErrorMsg(INVALID_LOGIN_ERRORS.INVALID_CREDENTIALS);
      return;
    }

    // --- Mock Data simulating API response ---
    const mockUserResponse = {
      _id: "123",
      username: "Bobby",
      email: email,
      provider: "local" as const,
      profileImage: "https://mui.com/static/images/avatar/2.jpg" // Dummy image
    };
    const mockToken = "abc-123-token";

    login(mockUserResponse, mockToken);

    // --- MOCK LOGIN SUCCESS ---
    // localStorage.setItem('token', 'dummy_token'); // Simulate Auth Token
    navigate('/'); // Navigate to the Posts page (Home)
  };

  const onGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
    localStorage.setItem('token', 'dummy_token'); // TODO: del later after implementing server-api calls
    navigate('/');
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
              Sign In
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
          {/* <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ 
              flex: 1, 
              borderRadius: '20px', 
              borderColor: '#ccc', 
              color: '#000',
              textTransform: 'none' 
            }}
          >
            Google
          </Button> */}

          {/* <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{ 
              flex: 1, 
              borderRadius: '20px', 
              borderColor: '#ccc', 
              color: '#000',
              textTransform: 'none' 
            }}
          >
            Facebook
          </Button> */}

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