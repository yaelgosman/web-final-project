import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  IconButton,
  InputAdornment,
  Avatar,
  Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { INVALID_REGISTRATION_ERRORS } from '../constants/errors';

const Register: React.FC = () => {
    const navigate = useNavigate();
    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [registerErrorMsg, setRegisterErrorMsg] = useState('');    
  
    // Image State
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    // UI State
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setRegisterErrorMsg(INVALID_REGISTRATION_ERRORS.DIFFERENT_PASSWORDS);
            return;
        }

        if (formData.email === '' || formData.password === '' || formData.username === '' || formData.confirmPassword === '') {
            setRegisterErrorMsg(INVALID_REGISTRATION_ERRORS.MISSING_FIELDS);
            return;
        }
        
        // Handle registration logic (include profileImage in FormData)
        console.log("Registering:", formData, profileImage); //for debug only.
        // TODO: add here the call to the Register API request.
        // TODO: add here later the navigatio to the HomePage!

        // --- MOCK REGISTER SUCCESS ---
        alert("Registration successful! Please login.");
        navigate('/login'); // Navigate to Login page
    };

    const onGoogleRegisterSuccess = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
    localStorage.setItem('token', 'dummy_token'); // TODO: del later after implementing server-api calls
    navigate('/');
  }

  const onGoogleRegisterFailiure = () => {
    console.log("google registration failed");
  }

    return (
        <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
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
                Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Join our community of food lovers
            </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                
                {/* Profile Image Upload */}
                <Stack direction="column" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Avatar 
                    src={previewUrl || undefined} 
                    sx={{ width: 80, height: 80, bgcolor: '#f2fcf9', color: '#004d40' }}
                >
                    {!previewUrl && <PersonAddIcon fontSize="large" />}
                </Avatar>
                <Button
                    component="label"
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    sx={{ color: '#004d40', textTransform: 'none' }}
                >
                    Upload Photo
                    <input 
                    type="file" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    />
                </Button>
                </Stack>

                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    variant="outlined"
                    value={formData.username}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                        mt: 1,
                        bgcolor: '#004d40',
                        color: '#fff',
                        borderRadius: '20px',
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#00382e' },
                    }}
                >
                    Sign Up
                </Button>

                {
                    (registerErrorMsg != '') && 
                    <Typography variant="body1" color="error" sx={{ alignSelf: 'center', fontWeight: 'bold', direction: 'rtl' }}>
                        {registerErrorMsg}
                    </Typography>
                } 
            </Stack>
            </form>

            <Box sx={{ my: 3 }}>
            <Divider>
                <Typography variant="caption" color="text.secondary">
                OR SIGN UP WITH
                </Typography>
            </Divider>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
                <GoogleLogin onSuccess={onGoogleRegisterSuccess} onError={onGoogleRegisterFailiure} />
            </Stack>
            
           <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                <Box component="span" sx={{ color: '#004d40', fontWeight: 'bold', textDecoration: 'underline' }}>
                    Login here
                </Box>
                </Link>
            </Typography>
        </Box>
        </Paper>
        </Container>
    );
};

export default Register;