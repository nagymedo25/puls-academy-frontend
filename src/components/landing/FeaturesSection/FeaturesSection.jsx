// src/components/landing/FeaturesSection/FeaturesSection.jsx
import React from 'react';
import { Box, Container, Typography, Paper, alpha } from '@mui/material';
// Removed Grid import to use Flexbox directly
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DevicesIcon from '@mui/icons-material/Devices';
import { keyframes } from '@emotion/react';

// Animation for elements to fade in and slide up
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animation for the background gradient lines
const moveLines = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(40px, 40px);
  }
`;

// Animation for the glowing border
const rotateBorder = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

// Animation for floating icons
const floatIcon = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;


const features = [
  {
    icon: <AutoStoriesIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    title: 'مناهج مصممة للتميز',
    description: 'محتوى علمي دقيق ومُحدَّث باستمرار، تم إعداده خصيصًا ليتوافق مع متطلبات كليتك ويضمن تفوقك.',
  },
  {
    icon: <PlayCircleOutlineIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    title: 'جرّب قبل أن تلتزم',
    description: 'شاهد الدرس الأول من أي كورس مجانًا بالكامل لتقييم جودة المحتوى بنفسك قبل اتخاذ قرار الشراء.',
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    title: 'طرق دفع مرنة وآمنة',
    description: 'نوفر لك خيارات دفع سهلة وموثوقة عبر فودافون كاش أو إنستا باي، مع ضمان أمان بياناتك بالكامل.',
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    title: 'التعليم بين يديك',
    description: 'صُممت واجهاتنا لتعمل بكفاءة على جميع أجهزتك، مما يمنحك حرية التعلم في أي وقت ومن أي مكان.',
  },
];

const FeaturesSection = () => {
  return (
    <Box 
      id="features-section" // Ensured ID is present for smooth scrolling
      sx={{ 
        py: 12, 
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden' 
      }}
    >
      {/* Animated background lines */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        opacity: 0.3,
        backgroundImage: (theme) => `repeating-linear-gradient(
          -45deg,
          ${alpha(theme.palette.grey[300], 0.2)},
          ${alpha(theme.palette.grey[300], 0.2)} 1px,
          transparent 1px,
          transparent 20px
        )`,
        animation: `${moveLines} 20s linear infinite`,
        zIndex: 0,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="h2" 
            component="h2"
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.dark',
              mb: 2,
              animation: `${fadeInUp} 1s ease-out`,
            }}
          >
            تجربة تعليمية فريدة من نوعها
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              animation: `${fadeInUp} 1s ease-out 0.2s`,
              animationFillMode: 'both',
            }}
          >
            كل ما تحتاجه للنجاح والتفوق، جمعناه لك في مكان واحد.
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            gap: 4, // This creates space between cards
          }}
        >
          {features.map((feature, index) => (
            <Box 
              key={index}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 24px)' }, // Responsive width with gap calculation
                display: 'flex',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: '2px', // Padding to create space for the inner content from the border
                  textAlign: 'center',
                  borderRadius: '18px', // Slightly larger to accommodate the inner container
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'transparent',
                  opacity: 0,
                  animation: `${fadeInUp} 0.8s ease-out ${0.4 + index * 0.2}s forwards`,
                  
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '200%',
                    height: '200%',
                    background: (theme) => `conic-gradient(transparent, ${theme.palette.primary.main}, transparent 30%)`,
                    animation: `${rotateBorder} 4s linear infinite`,
                    opacity: 1, // Make the border visible by default
                  },
                }}
              >
                <Box sx={{
                  p: 4,
                  borderRadius: '16px',
                  height: '100%',
                  backgroundColor: alpha('#ffffff', 0.7),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: (theme) => `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      transition: 'transform 0.3s ease',
                      animation: `${floatIcon} 6s ease-in-out infinite`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
