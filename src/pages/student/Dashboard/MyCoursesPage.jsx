// src/pages/student/Dashboard/MyCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Button, Chip } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CourseService from '../../../services/courseService';
import AuthService from '../../../services/authService';
import './MyCourses.css'; // استيراد ملف التنسيق

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CourseStatusChip = ({ status }) => {
  const statusConfig = {
    active: { label: 'مفعّل', color: 'success', icon: <PlayCircleOutlineIcon /> },
    pending: { label: 'قيد المراجعة', color: 'warning', icon: <HourglassTopIcon /> },
    rejected: { label: 'مرفوض', color: 'error', icon: <ReportProblemIcon /> },
  };

  const config = statusConfig[status] || { label: status, color: 'default' };

  return <Chip icon={config.icon} label={config.label} color={config.color} size="small" />;
};

const EnrolledCourseCard = ({ course, delay }) => {
    const navigate = useNavigate();
    const isClickable = course.enrollment_status === 'active';

    const handleCardClick = () => {
        if (isClickable) {
            navigate(`/course/${course.course_id}/watch`); // To be created later
        }
    };

    return (
        <Grid item xs={12} md={6} lg={4}>
            <Paper className="enrolled-course-card" onClick={handleCardClick} sx={{ animationDelay: `${delay}s`, cursor: isClickable ? 'pointer' : 'not-allowed' }}>
                <Box className="card-thumbnail-wrapper">
                    <img src={course.thumbnail_url} alt={course.title} />
                    <div className="card-overlay" />
                    <div className="card-status-chip">
                        <CourseStatusChip status={course.enrollment_status} />
                    </div>
                </Box>
                <Box className="card-content-wrapper">
                    <Typography variant="h6" className="course-title">{course.title}</Typography>
                    <Typography variant="body2" className="course-category">
                        <SchoolIcon /> {course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
                    </Typography>
                    <div className="card-footer">
                        <Typography variant="body2" className="lessons-count">{course.lessons_count || 0} درس</Typography>
                        {isClickable && <Button size="small" variant="contained" startIcon={<PlayCircleOutlineIcon />}>ابدأ المشاهدة</Button>}
                    </div>
                </Box>
            </Paper>
        </Grid>
    );
};


const MyCoursesPage = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, coursesRes] = await Promise.all([
                    AuthService.getProfile(),
                    CourseService.getAvailableCourses()
                ]);
                setUser(profileRes.data.user);
                setCourses(coursesRes.data.courses || []);
            } catch (err) {
                setError('فشل في تحميل بياناتك. يرجى المحاولة مرة أخرى.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ animation: `${fadeInUp} 0.5s ease-out` }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>مرحباً بعودتك، {user?.name}!</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>استكشف كورساتك المسجلة وابدأ رحلتك التعليمية.</Typography>
            </Box>

            {courses.length > 0 ? (
                <Grid container spacing={4}>
                    {courses.map((course, index) => (
                        <EnrolledCourseCard key={course.course_id} course={course} delay={0.1 * (index + 1)} />
                    ))}
                </Grid>
            ) : (
                <Paper sx={{ p: 5, textAlign: 'center', animation: `${fadeInUp} 0.6s ease-out` }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>لم تشترك في أي كورس بعد.</Typography>
                    <Typography color="text.secondary">استكشف مكتبة الكورسات وابدأ رحلتك نحو التفوق اليوم.</Typography>
                    <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/courses')}>تصفح الكورسات</Button>
                </Paper>
            )}
        </Box>
    );
};

export default MyCoursesPage;
