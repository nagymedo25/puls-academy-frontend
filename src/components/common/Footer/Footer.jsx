// src/components/common/Footer/Footer.jsx
import React from 'react';
import { Box, Container, Typography, IconButton, Stack, Grid, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // استيراد RouterLink
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import Logo from '../../../assets/logo2.png';

// 1. تحديث الروابط
const quickLinks = [
    { title: 'الرئيسية', path: '/' },
    { title: 'من نحن', path: '/#about-us' }, // روابط الأقسام تعمل بشكل أفضل من الصفحة الرئيسية
    { title: 'تواصل معنا', path: '/#contact' },
];

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 6, backgroundColor: 'primary.dark', color: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Column 1: Logo and About */}
          <Grid item xs={12} md={4}>
            <img src={Logo} alt="Puls Academy Logo" style={{ height: '50px', marginBottom: '1rem' }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              منصة تعليمية متخصصة في تقديم كورسات عالية الجودة لطلاب كليات الصيدلة وطب الأسنان في مصر.
            </Typography>
          </Grid>

          {/* Column 3: Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              تواصل معنا
            </Typography>
            <Stack spacing={2}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <EmailIcon />
                    <Link href="mailto:alaae5607@gmail.com" color="inherit" underline="hover">
                        alaae5607@gmail.com
                    </Link>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <WhatsAppIcon />
                    <Link href="https://wa.me/201558963676" color="inherit" underline="hover">
                        201558963676+
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
            <IconButton sx={{scale: 1.5}} href="https://www.facebook.com/profile.php?id=61580315197378" target="_blank" color="inherit"><FacebookIcon /></IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;