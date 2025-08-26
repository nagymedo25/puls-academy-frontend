// src/components/landing/HeroSection/HeroSection.jsx
import React from 'react';
import { Box, Button, Typography, Container, Stack } from '@mui/material';
import { keyframes } from '@emotion/react';

// Animation for the text
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroSection = () => {
  return (
    <Box
      sx={{
        pt: 8,
        pb: 6,
        textAlign: 'center',
        animation: `${fadeIn} 1s ease-in-out`,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            color: 'primary.dark',
            fontWeight: 700,
          }}
        >
          Puls Academy
        </Typography>
        <Typography variant="h3" component="p" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
          بوابتك للتفوق في عالم الصيدلة وطب الأسنان.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button variant="contained" color="primary" size="large">
            تصفح كورسات الصيدلة
          </Button>
          <Button variant="contained" color="secondary" size="large">
            تصفح كورسات طب الأسنان
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;