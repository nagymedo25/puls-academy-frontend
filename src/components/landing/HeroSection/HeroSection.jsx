import React from 'react';
import { Box, Typography, Container, useTheme, Grid, alpha, Paper } from '@mui/material';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
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

const backgroundPan = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
      animation: `${float} 8s ease-in-out infinite`,
      ...sx,
    }}
  />
);

const DepartmentSelection = () => {
  const theme = useTheme();
  const choices = [
    { type: 'pharmacy', label: 'قسم الصيدلة', link: '/courses?category=pharmacy', icon: <LocalPharmacyIcon sx={{ fontSize: '5rem' }} />, color: theme.palette.primary.dark },
    { type: 'dentistry', label: 'قسم الاسنان', link: '/courses?category=dentistry', icon: <MedicalServicesIcon sx={{ fontSize: '5rem' }} />, color: theme.palette.primary.main }
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(70vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundSize: '200% 200%',
        animation: `${backgroundPan} 15s ease infinite`,
        py: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 8 }} justifyContent="center">
          {choices.map((choice, index) => (
            <Grid item xs={12} md={5} key={choice.type} sx={{
              animation: `${fadeInUp} 0.8s ease-out ${0.2 + index * 0.2}s`,
              animationFillMode: 'both',
            }}>
              <Link to={choice.link} style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid transparent',
                    background: `linear-gradient(145deg, ${alpha(choice.color, 0.05)}, ${alpha(choice.color, 0.15)})`,
                    backdropFilter: 'blur(15px)',
                    transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05) rotate(1deg)',
                      borderColor: choice.color,
                      boxShadow: `0 0 40px ${alpha(choice.color, 0.4)}`,
                      '& .choice-icon': {
                        transform: 'scale(1.15) rotate(5deg)',
                        color: choice.color,
                      },
                      '& .choice-title': {
                          color: choice.color,
                      }
                    },
                  }}
                >
                  <Box
                    className="choice-icon"
                    sx={{
                      fontSize: '6rem',
                      color: alpha(theme.palette.text.primary, 0.7),
                      transition: 'transform 0.3s ease, color 0.3s ease',
                      mb: 2,
                    }}
                  >
                    {choice.icon}
                  </Box>
                  <Typography
                    className="choice-title"
                    variant="h3"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      transition: 'color 0.3s ease',
                      color: 'text.primary',
                    }}
                  >
                    {choice.label}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    اضغط هنا لعرض الكورسات المخصصة
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

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
                fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4.2rem' },
                animation: `${fadeInUp} 0.8s ease-out`,
                color: 'primary.dark',
              }}
            >
              المنصة الاولى الخاصة بطلاب جامعة الازهر
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
              كورسات تفاعلية ومحتوى مُبسط يواكب أحدث المناهج لضمان تفوقك في كليات الصيدلة وطب الاسنان.
            </Typography>
            <DepartmentSelection />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;