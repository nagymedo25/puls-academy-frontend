// src/pages/student/Dashboard/DashboardLayout.jsx
import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
  ListItemButton,
  Avatar, // لاستخدامه في الهيدر الجديد
  Typography, // لاستخدامه في الهيدر الجديد
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from '@mui/icons-material/Chat';
import PaymentIcon from "@mui/icons-material/Payment";
import Logo from "../../../assets/Logo1.png";
import AuthService from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext"; // لجلب بيانات المستخدم

// --- استيراد ملف التصميم الجديد ---
import './DashboardLayout.css';

const drawerWidth = 260;

const menuItems = [
  { text: "كورساتي", icon: <SchoolIcon />, path: "/dashboard" },
  { text: "مدفوعاتي", icon: <PaymentIcon />, path: "/dashboard/payments" },
  { text: "الإشعارات", icon: <NotificationsIcon />, path: "/dashboard/notifications" },
  { text: "ملفي الشخصي", icon: <AccountCircleIcon />, path: "/dashboard/profile" },
  { text: "الدعم الفني", icon: <ChatIcon />, path: "/dashboard/chat" },
];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // جلب بيانات المستخدم الحالي

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const drawer = (
    <div>
      <Toolbar sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <img src={Logo} alt="Puls Academy Logo" style={{ height: "40px" }} />
      </Toolbar>
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: "8px",
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": { backgroundColor: "primary.dark" },
                  "& .MuiListItemIcon-root": { color: "white" },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: "8px" }}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="تسجيل الخروج" />
          </ListItemButton>
        </ListItem>
      </Box>
    </div>
  );

  return (
    <Box className="dashboard-root">
      <CssBaseline />
      
      {/* --- الهيدر الجديد بتصميم CSS --- */}
      <header className="dashboard-app-bar">
        <div className="toolbar-content">
          <div className="header-left">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" className="header-title">
              لوحة تحكم الطالب
            </Typography>
          </div>
          <div className="header-right">
            <Typography className="user-name">{user?.name}</Typography>
            <Avatar className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
            </Avatar>
          </div>
        </div>
      </header>
      {/* --- نهاية الهيدر الجديد --- */}

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
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderLeft: "1px solid #eee",
              zIndex: 1200,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        className="dashboard-main-content"
      >
        <div className="toolbar-spacer" /> {/* عنصر لإعطاء مسافة بنفس ارتفاع الهيدر */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;