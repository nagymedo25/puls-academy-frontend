// src/components/admin/StudentFormModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const StudentFormModal = ({ open, onClose, onSave, student }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    college: '',
    gender: '',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        password: '',
        college: student.college || '',
        gender: student.gender || '',
      });
    } else {
      setFormData({ name: '', email: '', phone: '', password: '', college: '', gender: '' });
    }
  }, [student, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          {student ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="الاسم الكامل"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="رقم الهاتف"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="كلمة المرور (اتركها فارغة لعدم التغيير)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={!student}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>الكلية</InputLabel>
            <Select name="college" value={formData.college} label="الكلية" onChange={handleChange}>
              <MenuItem value="pharmacy">صيدلة</MenuItem>
              <MenuItem value="dentistry">أسنان</MenuItem>
            </Select>
          </FormControl>
          <FormControl component="fieldset" margin="normal" required>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
              <FormControlLabel value="male" control={<Radio />} label="ذكر" />
              <FormControlLabel value="female" control={<Radio />} label="أنثى" />
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>إلغاء</Button>
            <Button type="submit" variant="contained">حفظ</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default StudentFormModal;