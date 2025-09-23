import React from 'react';
import { Modal, Box, Typography, Button, keyframes } from '@mui/material';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';

// تعريف الأنيميشن باستخدام keyframes
const scaleUp = keyframes`
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const iconPulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const SessionExpiredModal = ({ open, onConfirm , message }) => {

  const displayMessage = message || 'لأسباب تتعلق بالأمان، تم تسجيل خروجك. يرجى تسجيل الدخول مرة أخرى للمتابعة.';


  return (
    <Modal
      open={open}
      aria-labelledby="session-expired-modal-title"
      aria-describedby="session-expired-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          p: 4,
          width: { xs: '90%', sm: 400 },
          borderRadius: '16px',
          backgroundColor: 'background.paper',
          boxShadow: 24,
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          animation: `${scaleUp} 0.4s cubic-bezier(0.38, 0.58, 0.27, 1.34)`, // تطبيق الأنيميشن
        }}
      >
        <Box
          sx={{
            mx: 'auto',
            mb: 2,
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: 'error.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LockClockOutlinedIcon
            sx={{
              fontSize: 40,
              color: 'error.main',
              animation: `${iconPulse} 2s infinite ease-in-out`, // تطبيق أنيميشن الأيقونة
            }}
          />
        </Box>

        <Typography id="session-expired-modal-title" variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
          انتهت صلاحية الجلسة
        </Typography>

        <Typography id="session-expired-modal-description" color="text.secondary" sx={{ mb: 3 }}>
            {displayMessage}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={onConfirm}
          sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
        >
          العودة لتسجيل الدخول
        </Button>
      </Box>
    </Modal>
  );
};

export default SessionExpiredModal;