// src/components/landing/FeaturesSection/FeaturesSection.jsx
import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { keyframes } from '@emotion/react';

// Animation for the feature cards
const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const features = [
  {
    icon: <SchoolIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    title: 'كورسات متخصصة',
    description: 'محتوى علمي دقيق أعده خبراء ومتخصصون في المجال.',
  },
  {
    icon: <PlayCircleOutlineIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    title: 'معاينة مجانية',
    description: 'جرّب الدرس الأول من أي كورس قبل اتخاذ قرار الشراء.',
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    title: 'دفع آمن وسهل',
    description: 'ادفع بسهولة وأمان عبر فودافون كاش أو إنستا باي.',
  },
  {
    icon: <PhoneIphoneIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    title: 'تعلم من أي مكان',
    description: 'صُممت الواجهات لتعمل بكفاءة على الهواتف المحمولة لتناسب أسلوب حياتك.',
  },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  animation: `${popIn} 0.5s ease-out ${index * 0.2}s forwards`,
                  opacity: 0,
                  transform: 'scale(0.5)',
                  height: '100%',
                }}
              >
                {feature.icon}
                <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;