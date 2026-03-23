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
import { getImageUrl } from '../utils/imageUtils';

const MainHeader: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <AppBar position="sticky" color="inherit" elevation={0} sx={{
            borderBottom: '1px solid #f0f0f0',
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)'
        }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>

                    <Typography
                        variant="h5"
                        onClick={() => navigate('/')}
                        sx={{ fontWeight: 900, cursor: 'pointer', fontFamily: 'serif', color: '#004d40' }}
                    >
                        LetItCook
                    </Typography>

                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5, border: '1px solid #eee' }}>
                        <Avatar
                            src={typeof user?.profileImageUrl === 'string' ? getImageUrl(user.profileImageUrl) : (user?.profileImageUrl ? URL.createObjectURL(user.profileImageUrl as File) : undefined)}
                            sx={{ width: 35, height: 35, bgcolor: '#004d40' }}
                        >
                            {user?.username?.charAt(0)}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{ sx: { borderRadius: 3, mt: 1, minWidth: 180, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' } }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight="bold">{user?.username}</Typography>
                            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
                            My Profile
                        </MenuItem>
                        <MenuItem onClick={() => { logout(); navigate('/login'); }}>
                            Logout
                        </MenuItem>
                    </Menu>

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default MainHeader;