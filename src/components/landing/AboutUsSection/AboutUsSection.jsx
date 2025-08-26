// src/components/landing/AboutUsSection/AboutUsSection.jsx
import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import UpdateIcon from '@mui/icons-material/Update';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { keyframes } from '@emotion/react';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const strengths = [
  {
    icon: <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'فريق من الخبراء',
    description: 'نخبة من أفضل المحاضرين والمتخصصين في مجالات الصيدلة وطب الأسنان.',
  },
  {
    icon: <UpdateIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'محتوى مُحدَّث باستمرار',
    description: 'نواكب آخر التطورات العلمية والمناهج الدراسية لنقدم لك الأفضل دائمًا.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'دعم فني متكامل',
    description: 'فريق دعم فني جاهز لمساعدتك في أي وقت وحل أي مشكلة قد تواجهك.',
  },
];

const AboutUsSection = () => {
  return (
    <Box id="about-us" sx={{ py: 10, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          لماذا تختار Puls Academy؟
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}>
          رؤيتنا في Puls Academy هي سد الفجوة بين التعليم الأكاديمي التقليدي ومتطلبات سوق العمل الحقيقية، من خلال تقديم محتوى تعليمي عالي الجودة يجمع بين الدقة العلمية والتطبيق العملي.
        </Typography>
        <Grid container spacing={5} justifyContent="center">
          {strengths.map((strength, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '16px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    animation: `${float} 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                    mb: 2,
                  }}
                >
                  {strength.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {strength.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
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