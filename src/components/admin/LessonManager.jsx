// src/components/admin/LessonManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, CircularProgress, Alert, Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AdminService from '../../services/adminService';

const LessonManager = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newLesson, setNewLesson] = useState({ title: '', video_url: '' });
  const [isAdding, setIsAdding] = useState(false);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getLessonsForCourse(courseId);
      setLessons(response.data.lessons || []);
    } catch (err) {
      setError('فشل في جلب الدروس.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  const handleDelete = async (lessonId) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الدرس؟')) {
      try {
        await AdminService.deleteLesson(lessonId);
        fetchLessons(); // Refresh list after delete
      } catch (err) {
        setError('فشل في حذف الدرس.');
      }
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.title || !newLesson.video_url) {
      setError('يجب إدخال عنوان ورابط الفيديو.');
      return;
    }
    setIsAdding(true);
    setError('');
    try {
      await AdminService.addLessonToCourse(courseId, newLesson);
      setNewLesson({ title: '', video_url: '' }); // Clear form
      fetchLessons(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.error || 'فشل في إضافة الدرس.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleInputChange = (e) => {
    setNewLesson({ ...newLesson, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      <Typography variant="h6" gutterBottom>الدروس الحالية</Typography>
      <List sx={{ maxHeight: 250, overflowY: 'auto', mb: 3 }}>
        {lessons.length > 0 ? (
          lessons.map((lesson, index) => (
            <ListItem
              key={lesson.lesson_id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(lesson.lesson_id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }
              divider
            >
              <ListItemText
                primary={`${index + 1}. ${lesson.title}`}
                secondary={lesson.video_url}
              />
            </ListItem>
          ))
        ) : (
          <Typography color="text.secondary">لا توجد دروس مضافة لهذا الكورس بعد.</Typography>
        )}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>إضافة درس جديد</Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="عنوان الدرس"
          name="title"
          value={newLesson.title}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="رابط الفيديو (Bunny.net)"
          name="video_url"
          value={newLesson.video_url}
          onChange={handleInputChange}
          fullWidth
        />
        <Button
          variant="contained"
          startIcon={isAdding ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={handleAddLesson}
          disabled={isAdding}
          sx={{ alignSelf: 'flex-start' }}
        >
          إضافة الدرس
        </Button>
      </Box>
    </Box>
  );
};

export default LessonManager;