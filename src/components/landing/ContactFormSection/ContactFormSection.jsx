// src/components/landing/ContactFormSection/ContactFormSection.jsx
import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to an API)
    console.log('Form submitted:', formData);
    // Optionally, clear the form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box id="contact" sx={{ py: 8, backgroundColor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          هل لديك استفسار؟ تواصل معنا
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="الاسم الكامل"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رسالتك"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="primary" size="large">
                إرسال الرسالة
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default ContactFormSection;