// src/components/common/AuthRedirectModal.jsx
import React from 'react';
import { Modal, Box, Typography, Button, Stack, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const AuthRedirectModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
        </IconButton>
        <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" component="h2" fontWeight="700">
          أكمل مشاهدة الكورس!
        </Typography>
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          للوصول إلى هذا الدرس وباقي محتوى الكورس، يرجى تسجيل الدخول أو إنشاء حساب جديد.
        </Typography>
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Button onClick={() => navigate('/register')} variant="contained" size="large">
            إنشاء حساب جديد
          </Button>
          <Button onClick={() => navigate('/login')} variant="outlined" size="large">
            تسجيل الدخول
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AuthRedirectModal;