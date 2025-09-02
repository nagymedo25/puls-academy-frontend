// src/pages/student/CourseWatchPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseService from '../../services/courseService';
import './CourseWatchPage.css';

// --- MUI Icons ---
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseWatchPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const getBunnyEmbedUrl = useCallback((playUrl) => {
        if (!playUrl || !playUrl.includes('mediadelivery.net/play')) return '';
        try {
            const embedUrl = new URL(playUrl.replace('/play/', '/embed/'));
            embedUrl.searchParams.set('autoplay', 'true');
            embedUrl.searchParams.set('preload', 'true');
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
                    // Start with the first lesson if available
                    setCurrentLesson(fetchedLessons[0]);
                }
            } catch (err) {
                setError(err.response?.data?.error || 'فشل في تحميل بيانات الكورس. قد لا يكون لديك صلاحية الوصول.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();

        // Prevent right-click for security
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, [courseId]);

    const handleLessonClick = (lesson) => {
        // Since the user is on this page, they have access.
        // The API already filtered inaccessible lessons.
        setCurrentLesson(lesson);
    };

    if (loading) {
        return (
            <div className="watch-page-loader">
                <div className="spinner"></div>
                <p>جارٍ تحضير بيئة التعلم الخاصة بك...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="watch-page-error">
                <h2>حدث خطأ</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    العودة للوحة التحكم
                </button>
            </div>
        );
    }

    return (
        <main className={`watch-page-container ${sidebarOpen ? 'sidebar-visible' : ''}`}>
            {/* --- Animated Aurora Background --- */}
            <div className="aurora aurora-1"></div>
            <div className="aurora aurora-2"></div>
            <div className="aurora aurora-3"></div>

            {/* --- Mobile Sidebar Toggle Button --- */}
            <button className="sidebar-toggle-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MenuIcon />
            </button>
            
            {/* --- Main Content (Player and Description) --- */}
            <section className="main-content-area">
                <header className="main-content-header">
                    <h1 className="current-lesson-title">{currentLesson?.title || 'اختر درسًا للبدء'}</h1>
                    <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowBackIcon />
                        <span>العودة للوحة التحكم</span>
                    </button>
                </header>

                <div className="video-player-wrapper">
                    <div className="video-glow-border"></div>
                    {currentLesson ? (
                        <iframe
                            key={currentLesson.lesson_id} // Add key to force re-render on lesson change
                            src={getBunnyEmbedUrl(currentLesson.video_url)}
                            loading="eager"
                            title={currentLesson.title}
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            allowFullScreen={true}
                        ></iframe>
                    ) : (
                        <div className="video-placeholder">
                            <LockOutlinedIcon className="icon" />
                            <h2>هذا الدرس مقفل</h2>
                            <p>أكمل الدروس السابقة أو تأكد من اشتراكك في الكورس.</p>
                        </div>
                    )}
                </div>
                <div className="lesson-description-panel">
                    <h3>عن هذا الدرس</h3>
                    <p>{currentLesson?.description || 'لا يوجد وصف متاح لهذا الدرس حاليًا. ركز في محتوى الفيديو لتحقيق أقصى استفادة.'}</p>
                </div>
            </section>

            {/* --- Sidebar with Lessons Playlist --- */}
            <aside className="sidebar-lessons">
                <div className="sidebar-header">
                    <h2>{course?.title}</h2>
                    <p>{lessons.length} درس</p>
                </div>
                <ul className="lesson-list">
                    {lessons.length > 0 ? lessons.map((lesson, index) => (
                        <li
                            key={lesson.lesson_id}
                            className={`lesson-item ${currentLesson?.lesson_id === lesson.lesson_id ? 'active' : ''}`}
                            onClick={() => handleLessonClick(lesson)}
                        >
                            <div className="lesson-icon">
                               {currentLesson?.lesson_id === lesson.lesson_id ? <PlayCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
                            </div>
                            <div className="lesson-details">
                                <span className="lesson-number">الدرس {index + 1}</span>
                                <span className="lesson-title">{lesson.title}</span>
                            </div>
                        </li>
                    )) : (
                        <p className="no-lessons-message">لا توجد دروس متاحة في هذا الكورس بعد.</p>
                    )}
                </ul>
            </aside>
        </main>
    );
};

export default CourseWatchPage;