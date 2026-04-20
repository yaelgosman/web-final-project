/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { googleSignIn, registerUser } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
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
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterErrorMsg('');

        if (formData.password !== formData.confirmPassword) {
            setRegisterErrorMsg(INVALID_REGISTRATION_ERRORS.DIFFERENT_PASSWORDS);
            return;
        }

        try {
            setIsLoading(true);

            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);

            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }

            const response: any = await registerUser(formDataToSend as any);

            // saving the refresh token in local storage (important for the refresh mechanism)
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            // updating the context
            login(response.user || response, response.accessToken, response?.refreshToken);

            navigate('/');

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Registration failed";
            setRegisterErrorMsg(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onGoogleRegisterSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            setIsLoading(true);
            const response: any = await googleSignIn(credentialResponse);

            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            login(response, response.accessToken);
            navigate('/');
        } catch (error) {
            setRegisterErrorMsg("Google registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    const onGoogleRegisterFailiure = () => {
        console.log("google registration failed");
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
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 900,
                        color: '#2c3e50',
                        mb: 1
                    }}>
                        LetItCook
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Join our community of foodies
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                            <Avatar
                                src={previewUrl || undefined}
                                sx={{
                                    width: 100, height: 100,
                                    border: '3px solid #004d40',
                                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                                }}                            >
                                {!previewUrl && <PersonAddIcon fontSize="large" />}
                            </Avatar>
                            <Button
                                component="label"
                                size="small"
                                variant="text"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mt: 1, textTransform: 'none', color: '#004d40' }}
                            >
                                Upload Photo
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </Button>
                        </Box>

                        <TextField
                            label="Username"
                            name="username"
                            fullWidth
                            variant="outlined"
                            value={formData.username}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            label="Email Address"
                            name="email"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
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
        </Container >
    );
};

export default Register;