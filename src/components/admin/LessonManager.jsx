// src/components/admin/LessonManager.jsx
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AdminService from '../../services/adminService';
import './LessonManager.css'; // ✨ استيراد ملف التنسيقات

const LessonManager = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // ✨ إضافة الوصف للحالة
  const [newLesson, setNewLesson] = useState({ title: '', description: '', video_url: '' });
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
        fetchLessons();
      } catch (err) {
        setError('فشل في حذف الدرس.');
      }
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!newLesson.title || !newLesson.video_url) {
      setError('يجب إدخال عنوان ورابط الفيديو.');
      return;
    }
    setIsAdding(true);
    setError('');
    try {
      await AdminService.addLessonToCourse(courseId, newLesson);
      setNewLesson({ title: '', description: '', video_url: '' }); // تفريغ الحقول
      fetchLessons();
    } catch (err) {
      setError(err.response?.data?.error || 'فشل في إضافة الدرس.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleInputChange = (e) => {
    setNewLesson({ ...newLesson, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="lesson-manager-container">
      {error && <div className="lesson-manager-error">{error}</div>}
      <h6 className="section-title">الدروس الحالية</h6>
      <div className="lessons-list-container">
        {lessons.length > 0 ? (
          <ul className="lessons-list-ul">
            {lessons.map((lesson, index) => (
              <li key={lesson.lesson_id} className="lesson-list-item">
                <div className="lesson-details">
                  <p className="lesson-title">{`${index + 1}. ${lesson.title}`}</p>
                  <p className="lesson-url">{lesson.video_url}</p>
                </div>
                <button className="delete-lesson-btn" onClick={() => handleDelete(lesson.lesson_id)}>
                  <DeleteIcon />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ padding: '16px' }}>لا توجد دروس مضافة لهذا الكورس بعد.</p>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '24px 0' }} />

      <h6 className="section-title">إضافة درس جديد</h6>
      <form onSubmit={handleAddLesson} className="add-lesson-form">
        <input
          type="text"
          name="title"
          placeholder="عنوان الدرس"
          value={newLesson.title}
          onChange={handleInputChange}
          className="form-input"
        />
        <textarea
          name="description"
          placeholder="وصف مختصر للدرس (اختياري)"
          value={newLesson.description}
          onChange={handleInputChange}
          className="form-textarea"
        />
        <input
          type="text"
          name="video_url"
          placeholder="رابط الفيديو (Bunny.net)"
          value={newLesson.video_url}
          onChange={handleInputChange}
          className="form-input"
        />
        <button type="submit" className="add-lesson-btn" disabled={isAdding}>
          {isAdding ? 'جاري الإضافة...' : 'إضافة الدرس'}
        </button>
      </form>
    </div>
  );
};

export default LessonManager;