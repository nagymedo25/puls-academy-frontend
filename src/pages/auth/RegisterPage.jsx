// src/pages/auth/RegisterPage.jsx
import React, { useState, useMemo } from 'react';
import {
  Box, Button, Typography, Container, TextField,
  Select, MenuItem, FormControl, InputLabel, RadioGroup,
  FormControlLabel, Radio, CircularProgress, Alert, Link as MuiLink, LinearProgress
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import PersonOutline from '@mui/icons-material/PersonOutline';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import WcOutlined from '@mui/icons-material/WcOutlined';
import AuthService from '../../services/authService';
import Logo from '../../assets/Logo1.png';

// Keyframes for animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(15px, -15px) rotate(180deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
`;

// Abstract shape component for background decoration
const AbstractShape = ({ sx }) => (
  <Box
    sx={{
      position: 'absolute',
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.light}33, ${theme.palette.primary.main}33)`,
      animation: `${float} 15s ease-in-out infinite`,
      ...sx,
    }}
  />
);

// Helper function to calculate password strength
const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
};

const PasswordStrengthBar = ({ password }) => {
    const strength = getPasswordStrength(password);
    const color = ['#f44336', '#ff9800', '#ffc107', '#4caf50', '#4caf50'][strength - 1] || 'transparent';
    const value = (strength / 5) * 100;
    const label = ['ضعيفة جدًا', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جدًا'][strength - 1] || '';

    return (
        <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress 
                variant="determinate" 
                value={value} 
                sx={{ 
                    height: 8, 
                    borderRadius: 5, 
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': { backgroundColor: color, transition: 'transform .4s linear' } 
                }} 
            />
            <Typography variant="caption" color={color} sx={{ display: 'block', textAlign: 'right', mt: 0.5, height: '1.2em' }}>
                {label}
            </Typography>
        </Box>
    );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) {
        setEmailError('البريد الإلكتروني مطلوب.');
        return false;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
        setEmailError('صيغة البريد الإلكتروني غير صحيحة.');
        return false;
    }
    if (/(mailinator|temp-mail|10minutemail)\./.test(email)) {
         setEmailError('لا يمكن استخدام خدمات البريد الإلكتروني المؤقت.');
         return false;
    }
    setEmailError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
     if (name === 'email') {
        validateEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.values(formData).some(field => field === '')) {
        setError('يرجى ملء جميع الحقول المطلوبة.');
        return;
    }
    if (!validateEmail(formData.email)) return;
    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    if (getPasswordStrength(formData.password) < 3) {
        setError('كلمة المرور يجب أن تكون "متوسطة" على الأقل.');
        return;
    }

    setSuccess('');
    setLoading(true);

    try {
      const { confirmPassword, ...apiData } = formData;
      const response = await AuthService.register(apiData);
      
      // تسجيل الدخول مباشرة بعد التسجيل
      localStorage.setItem('token', response.data.token);
      
      setSuccess(`أهلاً بك ${response.data.user.name}! جاري توجيهك إلى لوحة التحكم...`);

      setTimeout(() => {
        navigate('/dashboard', { state: { fromRegistration: true } });
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ ما. قد يكون البريد الإلكتروني مسجلاً بالفعل.');
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = useMemo(() => {
    return (
      loading ||
      !!emailError ||
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.college ||
      !formData.gender ||
      formData.password !== formData.confirmPassword ||
      getPasswordStrength(formData.password) < 3
    );
  }, [formData, emailError, loading]);

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
      <AbstractShape sx={{ width: 250, height: 250, top: '-50px', left: '-80px', animationDuration: '20s' }} />
      <AbstractShape sx={{ width: 150, height: 150, top: '20%', right: '-50px', animationDuration: '18s' }} />
      <AbstractShape sx={{ width: 200, height: 200, bottom: '-70px', right: '20%', animationDuration: '22s' }} />
      <AbstractShape sx={{ width: 100, height: 100, bottom: '10%', left: '-30px', animationDuration: '16s' }} />
      
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
              إنشاء حساب جديد
            </Typography>
            <Typography variant="body1" color="text.secondary">
              انضم إلينا وابدأ رحلتك نحو التفوق
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="الاسم الكامل"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{ startAdornment: <PersonOutline sx={{ mr: 1, color: 'action.active' }} /> }}
              />
              <TextField
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!emailError}
                helperText={emailError}
                InputProps={{ startAdornment: <EmailOutlined sx={{ mr: 1, color: 'action.active' }} /> }}
              />
              <Box>
                <TextField
                    label="كلمة المرور"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputProps={{ startAdornment: <LockOutlined sx={{ mr: 1, color: 'action.active' }} /> }}
                />
                <PasswordStrengthBar password={formData.password} />
              </Box>
              <TextField
                label="تأكيد كلمة المرور"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'كلمتا المرور غير متطابقتين' : ''}
                InputProps={{ startAdornment: <LockOutlined sx={{ mr: 1, color: 'action.active' }} /> }}
              />
              <FormControl fullWidth required>
                <InputLabel id="college-select-label">الكليّة</InputLabel>
                <Select
                  labelId="college-select-label"
                  name="college"
                  value={formData.college}
                  label="الكليّة"
                  onChange={handleChange}
                  startAdornment={<SchoolOutlined sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="pharmacy">الصيدلة</MenuItem>
                  <MenuItem value="dentistry">طب الأسنان</MenuItem>
                </Select>
              </FormControl>
              <FormControl component="fieldset" required>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                   <WcOutlined />
                   <Typography component="legend" variant="body1">النوع</Typography>
                </Box>
                <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                  <FormControlLabel value="male" control={<Radio />} label="ذكر" />
                  <FormControlLabel value="female" control={<Radio />} label="أنثى" />
                </RadioGroup>
              </FormControl>

              {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 1 }}>{success}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isButtonDisabled}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  position: 'relative',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : 'إنشاء الحساب'}
              </Button>

              <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                لديك حساب بالفعل؟{' '}
                <MuiLink component={Link} to="/login" fontWeight="bold">
                  تسجيل الدخول
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;