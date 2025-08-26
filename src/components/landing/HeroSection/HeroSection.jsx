// src/components/landing/HeroSection/HeroSection.jsx
import React from 'react';
import { Box, Button, Typography, Container, Stack, Grid, alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import SchoolIcon from '@mui/icons-material/School'; // Pharmacy Icon
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // Dentistry Icon

// Keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(10px, -20px); }
  100% { transform: translate(0, 0); }
`;

// Abstract shape component for subtle background decoration
const AbstractShape = ({ sx }) => (
  <Box
    sx={{
      position: 'absolute',
      borderRadius: '50%',
      background: (theme) => alpha(theme.palette.primary.light, 0.1),
      // This animation runs continuously and is not tied to a hover state.
      animation: `${float} 8s ease-in-out infinite`,
      ...sx,
    }}
  />
);


const HeroSection = () => {
  return (
    <Box
      id="hero-section" // Added ID for smooth scrolling
      sx={{
        position: 'relative',
        minHeight: { xs: '90vh', md: 'calc(100vh - 64px)' }, // Adjust height considering the header
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.paper', // Light theme background
        overflow: 'hidden',
        py: { xs: 8, md: 6 },
      }}
    >
      {/* Background shapes for decoration */}
      <AbstractShape sx={{ width: 200, height: 200, top: '10%', left: '-50px', animationDelay: '0s' }} />
      <AbstractShape sx={{ width: 100, height: 100, top: '20%', right: '5%', animationDelay: '2s' }} />
      <AbstractShape sx={{ width: 150, height: 150, bottom: '10%', right: '-70px', animationDelay: '4s' }} />
      <AbstractShape sx={{ width: 50, height: 50, bottom: '25%', left: '10%', animationDelay: '6s' }} />

      <Container maxWidth="lg" sx={{ zIndex: 1, textAlign: 'center' }}>
        <Grid container alignItems="center" justifyContent="center" spacing={4}>
          <Grid item xs={12} md={10} lg={8}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' },
                animation: `${fadeInUp} 0.8s ease-out`,
                color: 'primary.dark',
              }}
            >
              غيّر طريقة فهمك للمواد الطبية
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                my: 4, 
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.8,
                color: 'text.secondary',
                animation: `${fadeInUp} 0.8s ease-out 0.2s`,
                animationFillMode: 'both',
              }}
            >
              كورسات تفاعلية ومحتوى مُبسط يواكب أحدث المناهج لضمان تفوقك في عالم الصيدلة وطب الأسنان.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              gap={{ xs: 2, sm: 3 }} // Increased spacing for larger screens
              justifyContent="center"
              sx={{
                animation: `${fadeInUp} 0.8s ease-out 0.4s`,
                animationFillMode: 'both',
              }}
            >
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                startIcon={<SchoolIcon />} // Changed to startIcon for correct RTL layout
                sx={{
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 3,
                  },
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  gap: 1, // Added gap for spacing between text and icon
                }}
              >
                كورسات الصيدلة
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
                startIcon={<MedicalServicesIcon />} // Changed to startIcon for correct RTL layout
                sx={{
                   '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04)
                  },
                  transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  gap: 1, // Added gap for spacing between text and icon
                }}
              >
                كورسات طب الأسنان
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
