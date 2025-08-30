// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import {
  Box, Button, Typography, Container, TextField,
  CircularProgress, Alert, Link as MuiLink, Checkbox, FormControlLabel
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import AuthService from '../../services/authService';
import Logo from '../../assets/Logo1.png';

// ... (الـ Keyframes و AbstractShape تبقى كما هي) ...
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-15px, 15px) rotate(180deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
`;

const AbstractShape = ({ sx }) => (
  <Box
    sx={{
      position: 'absolute',
      borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%',
      background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.light}33, ${theme.palette.primary.main}33)`,
      animation: `${float} 15s ease-in-out infinite`,
      ...sx,
    }}
  />
);


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login(formData);
      const { token, refreshToken } = response.data;

      // 1. تخزين التوكن
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // 2. فك تشفير التوكن للحصول على صلاحية المستخدم
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;

      // 3. التوجيه بناءً على الصلاحية
      if (userRole === 'admin') {
        navigate('/admin'); // توجيه الأدمن إلى لوحة تحكم الأدمن
      } else {
        navigate('/dashboard'); // توجيه الطالب إلى لوحة تحكم الطالب
      }

    } catch (err) {
      setError(err.response?.data?.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.background.default} 0%, #ffffff 100%)`,
        py: 5,
      }}
    >
      {/* ... (باقي كود JSX يبقى كما هو بدون تغيير) ... */}
      <AbstractShape sx={{ width: 250, height: 250, top: '-50px', right: '-80px', animationDuration: '20s' }} />
      <AbstractShape sx={{ width: 150, height: 150, top: '30%', left: '-50px', animationDuration: '18s' }} />
      <AbstractShape sx={{ width: 200, height: 200, bottom: '-70px', left: '20%', animationDuration: '22s' }} />

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Link to="/">
              <img src={Logo} alt="Puls Academy Logo" style={{ height: '50px' }} />
            </Link>
            <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 700, color: 'primary.dark' }}>
              أهلاً بعودتك
            </Typography>
            <Typography variant="body1" color="text.secondary">
              سجّل دخولك لمتابعة رحلتك التعليمية
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <EmailOutlined sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <TextField
                label="كلمة المرور"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <LockOutlined sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="تذكرني"
                />
                <MuiLink component={Link} to="/forgot-password" variant="body2">
                  هل نسيت كلمة المرور؟
                </MuiLink>
              </Box>

              {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  position: 'relative',
                  mt: 1,
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : 'تسجيل الدخول'}
              </Button>

              <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
                ليس لديك حساب؟{' '}
                <MuiLink component={Link} to="/register" fontWeight="bold">
                  أنشئ حسابًا جديدًا
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;