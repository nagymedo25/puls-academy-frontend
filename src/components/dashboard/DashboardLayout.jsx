// src/components/dashboard/DashboardLayout.jsx
import React, { useState } from 'react';
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemIcon, ListItemText, Toolbar, Typography, useTheme, useMediaQuery
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat'; 
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../../assets/Logo1.png';
import AuthService from '../../services/authService';

const drawerWidth = 260;

const menuItems = [
  { text: 'كورساتي', icon: <SchoolIcon />, path: '/dashboard' },
  { text: 'الإشعارات', icon: <NotificationsIcon />, path: '/dashboard/notifications' },
  { text: 'ملفي الشخصي', icon: <AccountCircleIcon />, path: '/dashboard/profile' },
  { text: 'الدعم الفني', icon: <ChatIcon />, path: '/dashboard/chat' }, 

];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <img src={Logo} alt="Puls Academy Logo" style={{ height: '40px' }} />
      </Toolbar>
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)} sx={{
            borderRadius: '8px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white',
              '& .MuiListItemIcon-root': {
                color: 'white',
              }
            },
            '&.Mui-selected': {
                 backgroundColor: 'primary.main',
                 color: 'white',
                 '& .MuiListItemIcon-root': {
                    color: 'white',
                 }
            }
          }}>
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <ListItem button onClick={handleLogout} sx={{
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(249, 28, 69, 0.1)',
            }
        }}>
            <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="تسجيل الخروج" />
        </ListItem>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mr: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            لوحة تحكم الطالب
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          anchor="right"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderLeft: '1px solid #eee' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, backgroundColor: '#f9fafb', minHeight: '100vh' }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardLayout;
