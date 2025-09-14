// src/components/admin/CourseFormModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// ✨ ١. استيراد ملف الـ CSS الجديد
import './CourseFormModal.css';

const CourseFormModal = ({ open, onClose, onSave, course, loading }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'pharmacy', college_type: 'male', 
    price: '', preview_url: '', thumbnail_url: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || 'pharmacy',
        college_type: course.college_type || 'male',
        price: course.price || '',
        preview_url: course.preview_url || '',
        thumbnail_url: course.thumbnail_url || '',
      });
    } else {
      setFormData({
        title: '', description: '', category: 'pharmacy', college_type: 'male', 
        price: '', preview_url: '', thumbnail_url: ''
      });
    }
  }, [course, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* ✨ ٢. تطبيق الكلاس الرئيسي هنا */}
      <div className="course-modal-box">
        <Typography variant="h5" component="h2" fontWeight="700" mb={3}>
          {course ? 'تعديل الكورس' : 'إضافة كورس جديد'}
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* ✨ ٣. استخدام div بدلاً من Grid لتنسيق أفضل */}
          <div className="course-form-container">
            <TextField name="title" label="عنوان الكورس" value={formData.title} onChange={handleChange} fullWidth required />
            <TextField name="description" label="وصف الكورس" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} required />
            
            <div className="form-row">
              <FormControl fullWidth required>
                <InputLabel>القسم</InputLabel>
                <Select name="category" value={formData.category} label="القسم" onChange={handleChange}>
                  <MenuItem value="pharmacy">صيدلة</MenuItem>
                  <MenuItem value="dentistry">طب أسنان</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>الكلية</InputLabel>
                <Select name="college_type" value={formData.college_type} label="الكلية" onChange={handleChange}>
                  <MenuItem value="male">بنين</MenuItem>
                  <MenuItem value="female">بنات</MenuItem>
                </Select>
              </FormControl>
            </div>
            
            <div className="form-row">
                <TextField name="price" label="السعر (بالجنيه)" type="number" value={formData.price} onChange={handleChange} fullWidth required />
                <TextField name="thumbnail_url" label="رابط الصورة المصغرة" value={formData.thumbnail_url} onChange={handleChange} fullWidth required />
            </div>

            <TextField name="preview_url" label="رابط فيديو المعاينة" value={formData.preview_url} onChange={handleChange} fullWidth required />

            <div className="form-actions">
              <Button onClick={onClose} color="inherit">إلغاء</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : (course ? 'حفظ التعديلات' : 'إنشاء الكورس')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CourseFormModal;