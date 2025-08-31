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
  // ✨ تم حذف `lessons` state لأننا لن نطلبها هنا
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // ✨ الآن نطلب فقط بيانات الكورس الأساسية
        const courseRes = await CourseService.getCourseById(courseId);
        setCourse(courseRes.data.course);
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

  const getBunnyEmbedUrl = (playUrl) => {
    if (!playUrl || !playUrl.includes('mediadelivery.net/play')) {
      console.error("Invalid Bunny.net URL provided in database:", playUrl);
      return '';
    }
    try {
      const embedUrl = new URL(playUrl.replace('/play/', '/embed/'));
      embedUrl.searchParams.set('autoplay', 'false');
      return embedUrl.toString();
    } catch (e) {
      console.error("Could not parse Bunny.net URL", e);
      return '';
    }
  }

  const embedSrc = getBunnyEmbedUrl(course.preview_url);

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
              {/* ✨ تم تعديل هذا الجزء لعرض مثال توضيحي بدلًا من قائمة الدروس الحقيقية */}
              <ul className="lessons-list">
                <h2>الدروس الخاصة بالكورس :</h2>
                  <li className="lesson-item unlocked">
                    <PlayCircleIcon className="lesson-icon" />
                    <Typography variant="body1" fontWeight={600}>
                      الدرس الأول: مقدمة (متاح للمعاينة)
                    </Typography>
                  </li>
                  <li className="lesson-item locked" onClick={() => setIsModalOpen(true)}>
                    <LockIcon className="lesson-icon" />
                    <Typography variant="body1" fontWeight={400}>
                      الدرس الثاني: ... (مغلق)
                    </Typography>
                  </li>
                   <li className="lesson-item locked" onClick={() => setIsModalOpen(true)}>
                    <LockIcon className="lesson-icon" />
                    <Typography variant="body1" fontWeight={400}>
                      الدرس الثالث: ... (مغلق)
                    </Typography>
                  </li>
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