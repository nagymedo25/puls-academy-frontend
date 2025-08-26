// src/components/common/Header/Header.jsx
import React, { useState, useEffect } from "react";
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
  alpha,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'; // 1. استيراد Hooks
import Logo from "../../../assets/Logo1.png";

// 2. تحديث روابط التنقل
const navLinks = [
  { title: "الرئيسية", path: "/" },
  { title: "الكورسات", path: "/courses" },
  { title: "من نحن", id: "about-us" },
  { title: "المميزات", id: "features-section" },
  { title: "تواصل معنا", id: "contact" },
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation(); // 3. الحصول على المسار الحالي
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLinkClick = (link) => {
    if (drawerOpen) handleDrawerToggle();
    
    // إذا كان المسار الحالي هو الصفحة الرئيسية، قم بالتمرير
    if (link.id && location.pathname === '/') {
      const element = document.getElementById(link.id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    } else if (link.path) {
      // إذا كان مسارًا لصفحة، انتقل إليه
      navigate(link.path);
    } else if (link.id) {
        // إذا كان ID وموجود في صفحة أخرى، انتقل للرئيسية ثم مرر (للتطوير المستقبلي)
        navigate('/#' + link.id);
    }
  };
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", width: 250, p: 2 }}>
      <img src={Logo} alt="Puls Academy Logo" style={{ height: "40px", marginBottom: "1rem" }} />
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton onClick={() => handleLinkClick(link)} sx={{ textAlign: "center" }}>
              <ListItemText primary={link.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <Stack component="div" gap={2} sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/login" variant="outlined" color="primary" fullWidth>تسجيل الدخول</Button>
          <Button component={RouterLink} to="/register" variant="contained" color="primary" fullWidth>إنشاء حساب</Button>
        </Stack>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={isScrolled ? 3 : 0}
        sx={{
          backgroundColor: isScrolled ? alpha(theme.palette.background.paper, 0.85) : "transparent",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          transition: "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="Puls Academy Logo" style={{ height: "45px", transition: "transform 0.3s" }} />
          </Box>

          {isMobile ? (
            <IconButton color="primary" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 1 }}>
                {navLinks.map((link) => {
                  // 4. تحديد إذا كان الرابط هو الرابط النشط
                  const isActive = location.pathname === link.path;
                  return (
                    <Button
                      key={link.title}
                      onClick={() => handleLinkClick(link)}
                      sx={{
                        color: isActive ? 'primary.main' : 'text.primary',
                        fontWeight: 600,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: isActive ? "80%" : "0",
                          height: "2px",
                          bottom: "5px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: "primary.main",
                          transition: "width 0.3s ease",
                        },
                        "&:hover::after": { width: "80%" },
                      }}
                    >
                      {link.title}
                    </Button>
                  );
                })}
              </Box>

              <Stack direction="row" gap={1.5}>
                <Button component={RouterLink} to="/login" variant="outlined" color="primary">تسجيل الدخول</Button>
                <Button component={RouterLink} to="/register" variant="contained" color="primary" disableElevation>إنشاء حساب</Button>
              </Stack>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="temporary" open={drawerOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} anchor="right">
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;