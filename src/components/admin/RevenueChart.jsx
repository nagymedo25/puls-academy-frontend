// src/components/admin/RevenueChart.jsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const RevenueChart = () => {
  // ملاحظة: هذا المكون هو مجرد تصميم مبدئي
  // ستحتاج إلى تثبيت مكتبة مثل 'recharts' أو 'chart.js'
  // npm install recharts
  
  return (
    <Paper sx={{ p: 3, borderRadius: '16px', mt: 4, height: '400px' }} elevation={4}>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        نظرة عامة على الإيرادات
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
        <Typography>سيتم عرض الرسم البياني هنا بعد تثبيت المكتبة الخاصة به.</Typography>
      </Box>
    </Paper>
  );
};

export default RevenueChart;    