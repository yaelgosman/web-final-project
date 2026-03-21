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
import { VALID_PATHS } from '../constants/paths';
import { BASE_URL } from '../constants/server';

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

    // Handles dynamic navigation for the user's choice, (Options is to pass a specific state to the router: for example the logged user's id to the profile page)
    const handleNavigationToPages = (navigateTo: string, options?: { state?: any }) => {
        // if the given path doesnt exist (or isnt valid) - do nothing. (checks if exact match or if its a dynamic profile route by :id)
        const isValid = VALID_PATHS.includes(navigateTo) || navigateTo.startsWith('/profile')

        if (!isValid) {
            return;
        }

        // TODO: check if we even need this validation... since we already have a "fallback path * " for invalid paths...

        handleMenuClose();
        navigate(navigateTo, options);
    }

    const getAvatarUrl = (path: any) => {
        if (!path || typeof path !== 'string') return undefined;
        if (path.startsWith('http')) return path; // Allows Google Auth or external links to work

        // Clean out "public/" and format the string
        let cleanPath = path.replace(/^\\?public[\\/]?/, '/').replace(/^\/public\//, '/');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;

        return `${BASE_URL}${cleanPath}`;
    };

    return (
        <AppBar position="static" color="inherit" elevation={1} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ minHeight: '64px', justifyContent: 'space-between' }}>
            
            <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                <CookingReviewLogo onClick={() => handleNavigationToPages("/")} />
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

                <Button 
                    onClick={() => handleNavigationToPages('/addReview')}
                    color="inherit" sx={{ textTransform: 'none', fontWeight: 600, display: { xs: 'none', md: 'flex' } }}>
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

                        <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600, display: { xs: 'none', md: 'flex' } }}>
                            Review
                        </Button>

                        <Stack direction="row" spacing={0.5}>
                            <IconButton><NotificationsNoneIcon /></IconButton>
                        </Stack>

                        {
                            !isAuthenticated ? (
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
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar
                                            src={getAvatarUrl(user?.profileImagePath)}
                                            alt={user?.username || 'User'}
                                            sx={{ width: 40, height: 40, bgcolor: '#004d40' }}
                                        >
                                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                        </Avatar>
                                    </IconButton>

                                    <Menu
                                        anchorEl={anchorEl}
                                        id="account-menu"
                                        open={open}
                                        onClose={handleMenuClose}
                                        onClick={handleMenuClose}
                                        PaperProps={{
                                            elevation: 0,
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

                                        <MenuItem onClick={() => handleNavigationToPages("/profile")}>
                                            <Avatar src={getAvatarUrl(user?.profileImagePath)} /> <b>{user?.username}</b>
                                        </MenuItem>
                                        <Divider />

                                        <MenuItem onClick={() => handleNavigationToPages(`/profile/${user?._id}`, { state: { editMode: true } })}>
                                            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                            Profile Settings
                                        </MenuItem>

                                        <MenuItem onClick={() => handleNavigationToPages("/profile")}>
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