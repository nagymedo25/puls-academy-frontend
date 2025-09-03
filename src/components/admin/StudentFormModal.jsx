// src/components/admin/StudentFormModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, CircularProgress, Grid,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const StudentFormModal = ({ open, onClose, onSave, student, loading }) => {
  // ✨ 1. إضافة الحقول الجديدة للحالة الأولية
  const [formData, setFormData] = useState({
    name: '', email: '', college: '', gender: '', password: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        college: student.college || 'pharmacy',
        gender: student.gender || 'male',
        password: '', // اترك كلمة المرور فارغة دائمًا عند فتح النافذة
      });
    }
  }, [student, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // إرسال البيانات بدون حقل كلمة المرور إذا كان فارغًا
    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }
    onSave(dataToSend);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" fontWeight="700" mb={3}>
          تعديل بيانات الطالب
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* ✨ 2. إضافة الحقول الجديدة للنموذج */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField name="name" label="الاسم الكامل" value={formData.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="email" label="البريد الإلكتروني" type="email" value={formData.email} onChange={handleChange} fullWidth required />
            </Grid>
             <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                    <InputLabel>الكلية</InputLabel>
                    <Select name="college" value={formData.college} label="الكلية" onChange={handleChange}>
                        <MenuItem value="pharmacy">صيدلة</MenuItem>
                        <MenuItem value="dentistry">طب أسنان</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                 <FormControl fullWidth required>
                    <InputLabel>النوع</InputLabel>
                    <Select name="gender" value={formData.gender} label="النوع" onChange={handleChange}>
                        <MenuItem value="male">بنين</MenuItem>
                        <MenuItem value="female">بنات</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    name="password" 
                    label="كلمة مرور جديدة (اختياري)" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    fullWidth 
                    helperText="اترك الحقل فارغًا لعدم تغيير كلمة المرور"
                />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} color="inherit">إلغاء</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default StudentFormModal;