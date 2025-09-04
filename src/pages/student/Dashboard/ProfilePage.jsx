// src/pages/student/Dashboard/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  PersonOutline,
  EmailOutlined,
  LockOutlined,
  SchoolOutlined,
  WcOutlined,
  PhoneOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";
import AuthService from "../../../services/authService";
import "./Profile.css";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    college: "pharmacy",
    gender: "male",
    phone: "",
    countryCode: "+20",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      const countryCodeMatch = user.phone?.match(/^\+(\d{1,3})/);
      const number = user.phone?.replace(/^\+\d{1,3}/, "");
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        college: user.college || "pharmacy",
        gender: user.gender || "male",
        phone: number || "",
        countryCode: countryCodeMatch ? `+${countryCodeMatch[1]}` : "+20",
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setSuccess("");
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const fullPhoneNumber = `${profileData.countryCode}${profileData.phone}`;
      const updatedData = {
        name: profileData.name,
        email: profileData.email,
        college: profileData.college,
        gender: profileData.gender,
        phone: fullPhoneNumber,
      };

      const response = await AuthService.updateProfile(updatedData);
      setUser(response.data);
      setSuccess("تم تحديث بياناتك بنجاح!");
    } catch (err) {
      setError(
        err.response?.data?.error || "فشل تحديث البيانات. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("كلمتا المرور الجديدتان غير متطابقتين.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await AuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccess("تم تغيير كلمة المرور بنجاح!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "فشل تغيير كلمة المرور. تحقق من صحة البيانات."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="profile-container">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        الملف الشخصي
      </Typography>
      <Paper elevation={3} className="profile-paper">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} className="profile-sidebar">
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: "3rem",
                bgcolor: "primary.main",
                mb: 2,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" fontWeight="600">
              {user?.name}
            </Typography>
            <Typography color="text.secondary">{user?.email}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="tabs"
              >
                <Tab label="المعلومات الشخصية" />
                <Tab label="تغيير كلمة المرور" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <form onSubmit={handleUpdateProfile}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="name"
                      label="الاسم الكامل"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="البريد الإلكتروني"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                   <Grid item xs={12}>
                     <Box sx={{ display: 'flex', gap: 2 }}>
                       <FormControl sx={{ minWidth: 120 }}>
                         <InputLabel>الرمز</InputLabel>
                         <Select
                           name="countryCode"
                           value={profileData.countryCode}
                           label="الرمز"
                           onChange={handleProfileChange}
                         >
                           <MenuItem value="+20">🇪🇬 +20</MenuItem>
                           <MenuItem value="+966">🇸🇦 +966</MenuItem>
                           <MenuItem value="+971">🇦🇪 +971</MenuItem>
                         </Select>
                       </FormControl>
                       <TextField
                         name="phone"
                         label="رقم الهاتف"
                         type="tel"
                         value={profileData.phone}
                         onChange={handleProfileChange}
                         fullWidth
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">
                               <PhoneOutlined />
                             </InputAdornment>
                           ),
                         }}
                       />
                     </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>الكليّة</InputLabel>
                      <Select
                        name="college"
                        value={profileData.college}
                        label="الكليّة"
                        onChange={handleProfileChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <SchoolOutlined />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="pharmacy">الصيدلة</MenuItem>
                        <MenuItem value="dentistry">طب الأسنان</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>النوع</InputLabel>
                      <Select
                        name="gender"
                        value={profileData.gender}
                        label="النوع"
                        onChange={handleProfileChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <WcOutlined />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="male">ذكر</MenuItem>
                        <MenuItem value="female">أنثى</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "حفظ التغييرات"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}

            {activeTab === 1 && (
              <form onSubmit={handleChangePassword}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      name="currentPassword"
                      label="كلمة المرور الحالية"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="newPassword"
                      label="كلمة المرور الجديدة"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="confirmNewPassword"
                      label="تأكيد كلمة المرور الجديدة"
                      type="password"
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      required
                      error={
                        passwordData.newPassword !==
                        passwordData.confirmNewPassword
                      }
                      helperText={
                        passwordData.newPassword !==
                        passwordData.confirmNewPassword
                          ? "كلمتا المرور غير متطابقتين"
                          : ""
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "تغيير كلمة المرور"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {success}
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfilePage;