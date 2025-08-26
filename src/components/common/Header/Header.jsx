// src/components/landing/Header/Header.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../../assets/Logo1.png';

const navLinks = [
  { title: 'الرئيسية', path: '#' },
  { title: 'من نحن', path: '#about-us' },
  { title: 'تواصل معنا', path: '#contact' },
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 }}>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton component="a" href={link.path}>
              <ListItemText primary={link.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <Button variant="outlined" color="primary" fullWidth>
            تسجيل الدخول
          </Button>
        </ListItem>
        <ListItem>
          <Button variant="contained" color="secondary" fullWidth>
            إنشاء حساب جديد
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        color="background"
        elevation={1}
        sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <Box
            component="a"
            href="#"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img src={Logo} alt="Puls Academy Logo" style={{ height: '40px' }} />
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navLinks.map((link) => (
                <Button key={link.title} color="primary" href={link.path}>
                  {link.title}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" color="primary">
                تسجيل الدخول
              </Button>
              <Button variant="contained" color="secondary">
                إنشاء حساب جديد
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          anchor="left"
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};

export default Header;