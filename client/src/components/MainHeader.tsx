import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  InputBase,
  Container,
  Stack,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit'; // For "Review"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CookingReviewLogo from './CookingLogo';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const MainHeader: React.FC = () => {
    const navigate = useNavigate(); // Hook for navigation
    const { user, isAuthenticated, logout } = useAuth(); // Access global state 

    // User Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/Login');
    }

    const handleSignIn = () => {
        navigate("/Login");
    }

    return (
        <AppBar position="static" color="inherit" elevation={1} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ minHeight: '64px', justifyContent: 'space-between' }}>
            
            <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                <CookingReviewLogo />
            </Stack>

            <Box 
                sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '24px',
                px: 2,
                py: 0.5,
                width: '400px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                }}
            >
                <SearchIcon sx={{ color: '#666', mr: 1 }} />
                <InputBase
                placeholder="Search"
                sx={{ flex: 1, fontSize: '0.95rem' }}
                />
            </Box>

            {/* Navigation Actions */}
            <Stack direction="row" alignItems="center" spacing={1}>
                
                <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600, display: { xs: 'none', md: 'flex' } }}>
                Discover
                </Button>

                <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600, display: { xs: 'none', md: 'flex' } }}>
                Review
                </Button>
                
                <Stack direction="row" spacing={0.5}>
                <IconButton><NotificationsNoneIcon /></IconButton>
                </Stack>

                {
                    !isAuthenticated ?  (
                        // if not logged in - show the 'sign in' button
                        <Button 
                            variant="contained" 
                            sx={{ 
                                bgcolor: '#000', 
                                color: '#fff', 
                                borderRadius: '20px', 
                                textTransform: 'none',
                                fontWeight: 'bold',
                                px: 3,
                                '&:hover': { bgcolor: '#333' }
                            }}
                            onClick={handleSignIn}
                        >
                            Sign in
                        </Button>
                    ) : (
                        // if logged in - show the user avatar & menu
                        <>
                            <IconButton
                                onClick={handleMenuOpen}
                                size='small'
                                sx={{ ml: 2 }}
                                aria-controls={ open ? 'account-menu' : undefined }
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar
                                    src={`${user?.profileImage}`}
                                    alt={user?.username}
                                    sx={{ width: 40, height: 40, bgcolor: '#004d40'}}
                                >
                                    {user?.username.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleMenuClose}
                                onClick={handleMenuClose}
                                PaperProps={{elevation: 0,
                                        sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0, right: 14, width: 10, height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >

                                <MenuItem onClick={handleMenuClose}>
                                    <Avatar src={`${user?.profileImage}`} /> <b>{user?.username}</b>
                                </MenuItem>
                                <Divider/>

                                <MenuItem onClick={handleMenuClose}>
                                    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                    Profile Settings
                                </MenuItem>
                                
                                <MenuItem onClick={handleMenuClose}>
                                    <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
                                    My Posts
                                </MenuItem>

                                <Divider />
                                
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                                    Logout
                                </MenuItem>

                            </Menu>

                        </>
                    )
                }
            </Stack>

            </Toolbar>
        </Container>
        </AppBar>
    );
};

export default MainHeader;