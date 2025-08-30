// src/pages/admin/StudentManagementPage.jsx
import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const StudentManagementPage = () => {
  // Logic for fetching and searching for students will be added here

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        إدارة الطلاب
      </Typography>
      <TextField
        fullWidth
        label="ابحث عن طالب بالاسم أو البريد الإلكتروني"
        variant="outlined"
        sx={{ mb: 4 }}
      />
      
      {/* A table or list of students will be displayed here */}
       <Typography>
        سيتم عرض قائمة الطلاب هنا مع إمكانية البحث وعرض التفاصيل.
      </Typography>
    </Box>
  );
};

export default StudentManagementPage;