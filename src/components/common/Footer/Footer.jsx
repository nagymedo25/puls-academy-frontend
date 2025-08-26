// src/components/landing/Footer/Footer.jsx
import React from 'react';
import { Box, Container, Typography, IconButton, Stack, Grid, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Logo from '../../../assets/logo2.png'; // Using the second logo for the footer

const quickLinks = [
    { title: 'الرئيسية', path: '#' },
    { title: 'من نحن', path: '#about-us' },
    { title: 'الكورسات', path: '/courses' },
    { title: 'تواصل معنا', path: '#contact' },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: 'primary.dark',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Column 1: Logo and About */}
          <Grid item xs={12} md={4}>
            <img src={Logo} alt="Puls Academy Logo" style={{ height: '50px', marginBottom: '1rem' }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              منصة تعليمية متخصصة في تقديم كورسات عالية الجودة لطلاب كليات الصيدلة وطب الأسنان في مصر.
            </Typography>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              روابط سريعة
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map(link => (
                <Link href={link.path} color="inherit" underline="hover" key={link.title}>
                  {link.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Column 3: Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              تواصل معنا
            </Typography>
            <Stack spacing={2}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <EmailIcon />
                    <Link href="mailto:contact@pulsacademy.com" color="inherit" underline="hover">
                        contact@pulsacademy.com
                    </Link>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <WhatsAppIcon />
                    <Link href="https://wa.me/201000000000" color="inherit" underline="hover">
                        +20 100 000 0000
                    </Link>
                </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            py: 2,
            mt: 4,
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} Puls Academy. جميع الحقوق محفوظة.
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton href="#" target="_blank" color="inherit">
              <FacebookIcon />
            </IconButton>
            <IconButton href="#" target="_blank" color="inherit">
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;