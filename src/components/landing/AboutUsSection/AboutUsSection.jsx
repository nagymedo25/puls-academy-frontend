// src/components/landing/AboutUsSection/AboutUsSection.jsx
import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DevicesIcon from '@mui/icons-material/Devices';
import { keyframes } from '@emotion/react';

// Animation for the cards to fade in and slide up
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animation for icons to have a gentle floating effect
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

// Animation for the orbiting flash effect
const orbit = keyframes`
  0% {
    transform: rotate(0deg) translateX(120px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(120px) rotate(-360deg);
  }
`;


const strengths = [
  {
    id: 1, // Added unique ID
    icon: <MenuBookIcon sx={{ fontSize: 60, color: 'common.white' }} />,
    title: 'محتوى علمي استثنائي',
    description: 'نقدم لك محتوى تعليمياً أعده نخبة من الخبراء، يتم تحديثه باستمرار ليواكب أحدث المناهج والتطورات العلمية.',
  },
  {
    id: 2, // Added unique ID
    icon: <OndemandVideoIcon sx={{ fontSize: 60, color: 'common.white' }} />,
    title: 'تجربة تعليمية تفاعلية',
    description: 'فيديوهات عالية الجودة، وشروحات عملية تركز على التطبيق، مصممة لتجعل رحلتك التعليمية ممتعة وفعالة.',
  },
  {
    id: 3, // Added unique ID
    icon: <SupportAgentIcon sx={{ fontSize: 60, color: 'common.white' }} />,
    title: 'دعم متواصل وفعّال',
    description: 'فريق دعم فني وأكاديمي متخصص جاهز للإجابة على استفساراتك وحل أي مشكلة قد تواجهك في أسرع وقت.',
  },
  {
    id: 4, // Added unique ID
    icon: <DevicesIcon sx={{ fontSize: 60, color: 'common.white' }} />,
    title: 'مرونة تواكب حياتك',
    description: 'تعلم في أي وقت ومن أي مكان. منصتنا متوافقة مع جميع الأجهزة لتمنحك حرية كاملة في تنظيم وقتك.',
  },
];

const AboutUsSection = () => {
  return (
    <Box 
      id="about-us" 
      sx={{ 
        py: 12, 
        backgroundColor: 'primary.dark', // Using the dark red from the theme
        color: 'white', // Default text color for the section
        overflow: 'hidden', // To contain animations
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="h2" 
            component="h2"
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: 'common.white', // White color for the main title
              mb: 3,
            }}
          >
            نحن شركاؤك في رحلة التفوق
          </Typography>
          <Typography 
            variant="h5" 
            color="rgba(255, 255, 255, 0.8)" // Slightly more opaque for better readability
            sx={{ 
              maxWidth: '850px', 
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            في Puls Academy، نحن لا نقدم كورسات فحسب، بل نبني جسرًا بين المعرفة الأكاديمية والتطبيق العملي. مهمتنا هي تمكين طلاب الصيدلة وطب الأسنان بالأدوات والمهارات التي يحتاجونها للنجاح في دراستهم ومسيرتهم المهنية.
          </Typography>
        </Box>
        
        <Grid container spacing={5} justifyContent="center" sx={{ maxWidth: { md: '960px' }, mx: 'auto' }}>
          {strengths.map((strength) => (
            <Grid item xs={12} sm={6} md={6} key={strength.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '20px',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out, background-color 0.4s ease',
                  animation: `${fadeInUp} 0.6s ease-out ${strength.id * 0.15}s forwards`,
                  opacity: 0,
                  position: 'relative', // Needed for the pseudo-element
                  overflow: 'visible', // Allow the flash to be visible outside the card
                  '&:hover': {
                    transform: 'translateY(-15px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: (theme) => `0 25px 50px -12px ${theme.palette.primary.main}33`,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: (theme) => `0 0 10px 2px white, 0 0 20px 4px ${theme.palette.primary.light}, 0 0 30px 6px ${theme.palette.primary.main}`,
                    animation: `${orbit} 6s linear infinite`,
                    opacity: 1, // Changed from 0 to 1 to be always visible
                    zIndex: -1,
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    animation: `${float} 4s ease-in-out infinite`,
                    animationDelay: `${strength.id * 0.2}s`,
                  }}
                >
                  {strength.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: '700',
                    color: 'common.white'
                  }}
                >
                  {strength.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="rgba(255, 255, 255, 0.7)"
                  sx={{
                    lineHeight: 1.6,
                  }}
                >
                  {strength.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUsSection;
