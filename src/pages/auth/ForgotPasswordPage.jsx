// src/pages/auth/ForgotPasswordPage.jsx
import React from 'react';
import { Box, Button, Typography, Container, Paper, alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';

// --- Animations ---

// A "breathing" or "pulsing" effect for the shapes
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

// A slow, mesmerizing rotation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Entrance animation for the content card
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// A new, more organic shape component
const AbstractShape = ({ sx, animation, duration, delay }) => (
  <Box
    sx={{
      position: 'absolute',
      // Creates blob-like shapes
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      background: (theme) => `linear-gradient(45deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.primary.main, 0.15)})`,
      animation: `${animation} ${duration} ease-in-out infinite alternate ${delay}`,
      ...sx,
    }}
  />
);

const ForgotPasswordPage = () => {
  // الرقم الخاص بالدعم الفني (يمكنك تغييره)
  const whatsappLink = `https://wa.me/201558963676`;

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 128px)', // Adjust height for header and footer
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'background.default',
          py: 8,
        }}
      >
        {/* Animated Shapes */}
        <AbstractShape animation={pulse} duration="10s" delay="0s" sx={{ width: 250, height: 250, top: '10%', left: '-80px' }} />
        <AbstractShape animation={spin} duration="25s" delay="2s" sx={{ width: 150, height: 150, top: '25%', right: '-50px' }} />
        <AbstractShape animation={pulse} duration="12s" delay="5s" sx={{ width: 200, height: 200, bottom: '5%', right: '20%' }} />
        <AbstractShape animation={spin} duration="30s" delay="7s" sx={{ width: 180, height: 180, bottom: '15%', left: '-40px' }} />

        <Container maxWidth="sm" sx={{ zIndex: 1 }}>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: '24px',
              textAlign: 'center',
              backgroundColor: alpha('#ffffff', 0.8),
              backdropFilter: 'blur(15px)',
              animation: `${fadeInUp} 0.8s ease-out`,
              border: '1px solid',
              borderColor: alpha('#000000', 0.08),
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ fontWeight: 800, color: 'primary.dark', mb: 2 }}
            >
              نسيت كلمة المرور؟
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4, lineHeight: 1.8 }}
            >
              لا تقلق، نحن هنا لمساعدتك. لإعادة تعيين كلمة المرور الخاصة بك، يرجى التواصل مباشرة مع فريق الدعم الفني عبر واتساب وسيقومون بمساعدتك في أسرع وقت.
            </Typography>

            <Button
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              startIcon={<WhatsAppIcon />}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'white',
                background: 'linear-gradient(45deg, #25D366 30%, #128C7E 90%)',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(37, 211, 102, 0.5)',
                }
              }}
            >
              تواصل مع الدعم الفني
            </Button>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 3, direction: 'ltr' }}
            >
              <strong>رقم الدعم:</strong> <span>+201558963676</span>
            </Typography>

          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;