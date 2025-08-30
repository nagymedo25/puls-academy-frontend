// src/pages/CourseDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LockIcon from '@mui/icons-material/Lock';

import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import CourseService from '../services/courseService';
import AuthRedirectModal from '../components/common/AuthRedirectModal';

import './CourseDetailPage.css';

  
const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseRes, lessonsRes] = await Promise.all([
          CourseService.getCourseById(courseId),
          CourseService.getCourseLessons(courseId)
        ]);
        setCourse(courseRes.data.course);
        setLessons(lessonsRes.data.lessons);
      } catch (err) {
        setError('فشل في تحميل بيانات الكورس. يرجى التأكد من الرابط والمحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error || !course) {
    return <Alert severity="error">{error || 'لم يتم العثور على الكورس.'}</Alert>;
  }

  // ✨ START: دالة جديدة لتحويل رابط 'play' إلى رابط 'embed' الصحيح ✨
  const getBunnyEmbedUrl = (playUrl) => {
    if (!playUrl || !playUrl.includes('mediadelivery.net/play')) {
      console.error("Invalid Bunny.net URL provided in database:", playUrl);
      return ''; // إرجاع رابط فارغ إذا كان الرابط غير صالح
    }
    try {
      // استبدال '/play/' بـ '/embed/' للحصول على رابط التضمين الصحيح
      const embedUrl = new URL(playUrl.replace('/play/', '/embed/'));
      // إضافة پارامترات مفيدة للتحكم في المشغل
      embedUrl.searchParams.set('autoplay', 'false'); // منع التشغيل التلقائي
      return embedUrl.toString();
    } catch (e) {
      console.error("Could not parse Bunny.net URL", e);
      return ''; // إرجاع رابط فارغ في حالة حدوث خطأ
    }
  }

  const embedSrc = getBunnyEmbedUrl(course.preview_url);
  // ✨ END: نهاية الدالة الجديدة ✨

  return (
    <>
      <Header />
      <main className="course-detail-page">
        <Container maxWidth="lg">
          <div className="page-grid">
            <div className="video-column">
              
              <div className="video-player-wrapper">
                {embedSrc ? (
                  <iframe
                    src={embedSrc}
                    loading="lazy"
                    title={course.title}
                    style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                  ></iframe>
                ) : (
                  // رسالة تظهر في حالة وجود مشكلة في الرابط
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                     <Typography color="white">فشل تحميل الفيديو. الرابط غير صالح.</Typography>
                  </Box>
                )}
              </div>

              <div className="course-meta">
                <h1>{course.title}</h1>
                <p>{course.description}</p>
              </div>
            </div>

            <div className="content-column">
              <Button 
                variant="contained" 
                size="large" 
                className="unlock-button"
                onClick={() => navigate('/register')}
              >
                افتح الكورس الآن ({course.price} ج.م)
              </Button>
              <ul className="lessons-list">
                <h2>الدروس الخاصة بالكورس :</h2>
                {lessons.map(lesson => (
                  <li 
                    key={lesson.lesson_id} 
                    className={`lesson-item ${lesson.is_preview ? 'unlocked' : 'locked'}`}
                    onClick={() => !lesson.is_preview && setIsModalOpen(true)}
                  >
                    {lesson.is_preview ? 
                      <PlayCircleIcon className="lesson-icon" /> : 
                      <LockIcon className="lesson-icon" />
                    }
                    <Typography variant="body1" fontWeight={lesson.is_preview ? 600 : 400}>
                      {lesson.title}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <AuthRedirectModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CourseDetailPage;

