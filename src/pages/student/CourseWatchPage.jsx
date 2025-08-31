// src/pages/student/CourseWatchPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// ✨ --- START: التعديل الرئيسي هنا --- ✨
// تم إضافة ListItemIcon إلى قائمة الاستيراد لحل الخطأ
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, CircularProgress, Alert, Paper, IconButton, useMediaQuery, useTheme, Divider, Button, ListItemIcon } from '@mui/material';
// ✨ --- END: التعديل الرئيسي هنا --- ✨
import MenuIcon from '@mui/icons-material/Menu';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CourseService from '../../services/courseService';
import './CourseWatchPage.css';

const CourseWatchPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const getBunnyEmbedUrl = useCallback((playUrl) => {
        if (!playUrl || !playUrl.includes('mediadelivery.net/play')) {
            return '';
        }
        try {
            const embedUrl = new URL(playUrl.replace('/play/', '/embed/'));
            embedUrl.searchParams.set('autoplay', 'true');
            return embedUrl.toString();
        } catch (e) {
            console.error("Could not parse Bunny.net URL", e);
            return '';
        }
    }, []);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const [courseRes, lessonsRes] = await Promise.all([
                    CourseService.getCourseById(courseId),
                    CourseService.getCourseLessons(courseId)
                ]);
                
                setCourse(courseRes.data.course);
                const fetchedLessons = lessonsRes.data.lessons;
                setLessons(fetchedLessons);

                if (fetchedLessons && fetchedLessons.length > 0) {
                    setCurrentLesson(fetchedLessons[0]);
                }
            } catch (err) {
                setError(err.response?.data?.error || 'فشل في تحميل بيانات الكورس. قد لا يكون لديك صلاحية الوصول.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();

        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, [courseId]);

    useEffect(() => {
        setSidebarOpen(!isMobile);
    }, [isMobile]);

    const handleLessonClick = (lesson) => {
        setCurrentLesson(lesson);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    if (loading) {
        return (
            <Box className="watch-page-loading">
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>جارٍ تحميل الكورس والدروس...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="watch-page-error">
                <Alert severity="error">{error}</Alert>
                <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
                    العودة للوحة التحكم
                </Button>
            </Box>
        );
    }

    return (
        <Box className="course-watch-container">
            {isMobile && (
                <IconButton 
                    onClick={() => setSidebarOpen(!sidebarOpen)} 
                    className="sidebar-toggle-button"
                    sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1100, backgroundColor: 'rgba(255,255,255,0.8)' }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            <Paper className={`sidebar ${sidebarOpen ? 'open' : ''}`} elevation={3}>
                <Typography variant="h6" className="sidebar-course-title" noWrap>
                    {course?.title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List className="lesson-list">
                    {lessons.length > 0 ? lessons.map((lesson) => (
                        <ListItem key={lesson.lesson_id} disablePadding>
                            <ListItemButton
                                selected={currentLesson?.lesson_id === lesson.lesson_id}
                                onClick={() => handleLessonClick(lesson)}
                                className="lesson-list-item"
                            >
                                <ListItemIcon>
                                    {currentLesson?.lesson_id === lesson.lesson_id ? (
                                        <PlayCircleFilledWhiteIcon color="primary" />
                                    ) : (
                                        <CircleOutlinedIcon color="action" />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={lesson.title}
                                    sx={{ '& .MuiListItemText-primary': { fontWeight: currentLesson?.lesson_id === lesson.lesson_id ? 'bold' : 'normal' } }}
                                />
                            </ListItemButton>
                        </ListItem>
                    )) : (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                            لا توجد دروس في هذا الكورس بعد.
                        </Typography>
                    )}
                </List>
            </Paper>

            <Box className="main-content">
                {currentLesson ? (
                    <>
                        <Typography variant="h5" component="h1" className="current-lesson-title">
                            {currentLesson.title}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <div className="video-player-wrapper">
                            <iframe
                                src={getBunnyEmbedUrl(currentLesson.video_url)}
                                loading="eager"
                                title={currentLesson.title}
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                allowFullScreen={true}
                            ></iframe>
                        </div>
                        <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: '12px' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>وصف الدرس</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                {'لا يوجد وصف لهذا الدرس.'}
                            </Typography>
                        </Paper>
                    </>
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            يرجى اختيار درس للبدء بالمشاهدة.
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

export default CourseWatchPage;