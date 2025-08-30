// src/pages/student/Dashboard/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, TextField, Button, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import AuthService from '../../../services/authService';
import './Profile.css'; // استيراد ملف التنسيق

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AuthService.getProfile();
        setProfile(response.data.user);
      } catch (err) {
        setError('فشل في تحميل بيانات الملف الشخصي.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      setError('');
      setSuccess('');
      try {
          await AuthService.updateProfile({ name: profile.name, email: profile.email });
          setSuccess('تم تحديث بياناتك بنجاح!');
      } catch (err) {
          setError(err.response?.data?.error || 'فشل تحديث البيانات.');
      } finally {
          setIsSaving(false);
      }
  };

  const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      if (password.newPassword !== password.confirmNewPassword) {
          setError('كلمتا المرور الجديدتان غير متطابقتين.');
          return;
      }
      setIsChangingPassword(true);
      setError('');
      setSuccess('');
      try {
          await AuthService.changePassword({ currentPassword: password.currentPassword, newPassword: password.newPassword });
          setSuccess('تم تغيير كلمة المرور بنجاح!');
          setPassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } catch (err) {
          setError(err.response?.data?.error || 'فشل تغيير كلمة المرور.');
      } finally {
          setIsChangingPassword(false);
      }
  };


  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box className="profile-page-container">
      <Typography variant="h4" component="h1" className="profile-header">الملف الشخصي</Typography>
      
      <Grid container spacing={4}>
        {/* Profile Details Form */}
        <Grid item xs={12} md={6}>
            <Paper className="profile-paper">
                <Typography variant="h6" gutterBottom>تعديل البيانات الشخصية</Typography>
                <form onSubmit={handleProfileSubmit}>
                    <TextField label="الاسم الكامل" name="name" value={profile.name} onChange={handleProfileChange} fullWidth margin="normal" required />
                    <TextField label="البريد الإلكتروني" name="email" type="email" value={profile.email} onChange={handleProfileChange} fullWidth margin="normal" required />
                    <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={isSaving} sx={{ mt: 2 }}>
                        {isSaving ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
                    </Button>
                </form>
            </Paper>
        </Grid>
        
        {/* Change Password Form */}
        <Grid item xs={12} md={6}>
            <Paper className="profile-paper">
                <Typography variant="h6" gutterBottom>تغيير كلمة المرور</Typography>
                <form onSubmit={handlePasswordSubmit}>
                    <TextField label="كلمة المرور الحالية" name="currentPassword" type="password" value={password.currentPassword} onChange={handlePasswordChange} fullWidth margin="normal" required />
                    <TextField label="كلمة المرور الجديدة" name="newPassword" type="password" value={password.newPassword} onChange={handlePasswordChange} fullWidth margin="normal" required />
                    <TextField label="تأكيد كلمة المرور الجديدة" name="confirmNewPassword" type="password" value={password.confirmNewPassword} onChange={handlePasswordChange} fullWidth margin="normal" required />
                    <Button type="submit" variant="contained" color="secondary" startIcon={<LockResetIcon />} disabled={isChangingPassword} sx={{ mt: 2 }}>
                         {isChangingPassword ? <CircularProgress size={24} /> : 'تغيير كلمة المرور'}
                    </Button>
                </form>
            </Paper>
        </Grid>
      </Grid>
      
      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}
    </Box>
  );
};

export default ProfilePage;
