// src/pages/student/Dashboard/MyCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // أيقونة جديدة
import CourseService from '../../../services/courseService';
import AuthService from '../../../services/authService';
import PaymentFormModal from '../../../components/student/PaymentFormModal';
import CourseDetailModal from '../../../components/student/CourseDetailModal';

// --- استيراد ملف التصميم الجديد ---
import './MyCoursesPage.css';

// --- مكون جديد: رأس الترحيب المتحرك ---
const AnimatedWelcomeHeader = ({ userName }) => {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = `مرحباً بعودتك، ${userName}`;
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        if (!userName) return;

        setCharIndex(0);
        setDisplayedText('');

        const typingInterval = setInterval(() => {
            setCharIndex(prev => {
                if (prev < fullText.length) {
                    setDisplayedText(fullText.substring(0, prev + 1));
                    return prev + 1;
                } else {
                    clearInterval(typingInterval);
                    return prev;
                }
            });
        }, 80); // سرعة الكتابة

        return () => clearInterval(typingInterval);
    }, [userName, fullText]);

    return (
        <header className="dashboard-header animated-header">
            <div className="welcome-message-wrapper">
                <EmojiEventsIcon className="welcome-icon" /> {/* أيقونة متحركة */}
                <h1 className="welcome-title typing-effect" style={{color: 'black'}}>
                    {displayedText}
                    <span className="blinking-cursor" style={{color: 'red' , paddingRight : '5px' , transform : 'translateY(-5px)'}}>|</span> {/* مؤشر الكتابة */}
                </h1>
            </div>
            <p className="dashboard-subtitle">استكشف كورساتك المسجلة وتصفح الجديد في قسمك.</p>
        </header>
    );
};


// --- مكون حالة الكورس (بدون تغيير) ---
const CourseStatusChip = ({ status }) => {
  const statusConfig = {
    active: { label: 'مفعّل', icon: <PlayCircleOutlineIcon />, className: 'status-active' },
    pending: { label: 'قيد المراجعة', icon: <HourglassTopIcon />, className: 'status-pending' },
    rejected: { label: 'مرفوض', icon: <ReportProblemIcon />, className: 'status-rejected' },
  };
  const config = statusConfig[status] || { label: status, className: 'status-default' };

  return (
    <div className={`course-status-chip ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

// --- مكون بطاقة الكورس (بدون تغيير) ---
const CourseCard = ({ course, delay, onOpenDetails }) => {
    const navigate = useNavigate();
    const isEnrolled = course.enrollment_status !== 'available';
    const isClickable = course.enrollment_status === 'active';

    const handleButtonClick = (e) => {
        e.stopPropagation();
        if (isClickable) {
            navigate(`/course/${course.course_id}/watch`);
        } else {
            onOpenDetails(course);
        }
    };

    return (
        <div className="course-card-container" style={{ animationDelay: `${delay}s` }}>
            <div className="course-card-glow" />
            <div className="course-card">
                <div className="card-thumbnail-wrapper" onClick={() => onOpenDetails(course)}>
                    <img src={course.thumbnail_url} alt={course.title} className="card-thumbnail" />
                    <div className="card-overlay-gradient" />
                    {isEnrolled && <CourseStatusChip status={course.enrollment_status} />}
                </div>
                <div className="card-content-area">
                    <h3 className="course-title" onClick={() => onOpenDetails(course)}>
                        {course.title}
                    </h3>
                    <p className="course-category">
                        <SchoolIcon /> {course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
                    </p>
                    <div className="card-footer-details">
                        <span className="lessons-count">{course.lessons_count || 0} درس</span>
                        <button className="card-action-button" onClick={handleButtonClick}>
                            {isClickable ? <PlayCircleOutlineIcon /> : <VisibilityIcon />}
                            <span>{isClickable ? 'ابدأ المشاهدة' : 'عرض التفاصيل'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- المكون الرئيسي للصفحة ---
const MyCoursesPage = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);

    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            setLoading(true);
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

    useEffect(() => {
        fetchCourses();
    }, []);
    
    const enrolledCourses = courses.filter(c => c.enrollment_status !== 'available');
    const availableCourses = courses.filter(c => c.enrollment_status === 'available');

    const handleOpenDetailModal = (course) => {
        setSelectedCourse(course);
        setOpenDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setOpenDetailModal(false);
        setSelectedCourse(null);
    };

    const handleBuyNow = (course) => {
        setSelectedCourse(course);
        setOpenDetailModal(false);
        setOpenPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        setOpenPaymentModal(false);
        setSelectedCourse(null);
        fetchCourses();
    };

    if (loading) {
        return (
            <div className="page-loader">
                <div className="pulsing-logo"></div>
                <p>جاري تحميل لوحة التحكم...</p>
            </div>
        );
    }

    if (error) {
        return <div className="page-error-alert">{error}</div>;
    }

    return (
        <div className="my-courses-page">
            <AnimatedWelcomeHeader userName={user?.name || user?.email} /> {/* استخدام المكون الجديد */}
            
            <section>
                <h2 className="section-title">كورساتك الحالية</h2>
                {enrolledCourses.length > 0 ? (
                    <div className="courses-grid-layout">
                        {enrolledCourses.map((course, index) => (
                            <CourseCard 
                                key={course.course_id} 
                                course={course} 
                                delay={0.1 * (index + 1)}
                                onOpenDetails={handleOpenDetailModal}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-container">
                        <div className="empty-state-icon">📚</div>
                        <h3>لم تشترك في أي كورس بعد.</h3>
                        <p>الكورسات التي تقوم بشرائها ستظهر هنا.</p>
                    </div>
                )}
            </section>
            
            <section className="available-courses-section">
                <div className="section-divider">
                    <span>تصفح كورسات القسم</span>
                </div>
                {availableCourses.length > 0 ? (
                    <div className="courses-grid-layout">
                        {availableCourses.map((course, index) => (
                            <CourseCard 
                                key={course.course_id} 
                                course={course} 
                                delay={0.1 * (index + 1)}
                                onOpenDetails={handleOpenDetailModal}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-container">
                        <p>لا توجد كورسات أخرى متاحة في قسمك حالياً.</p>
                    </div>
                )}
            </section>

            <CourseDetailModal
                open={openDetailModal}
                onClose={handleCloseDetailModal}
                course={selectedCourse}
                onBuyNow={handleBuyNow}
            />

            <PaymentFormModal 
                open={openPaymentModal} 
                onClose={() => { setOpenPaymentModal(false); setSelectedCourse(null); }}
                onPaymentSuccess={handlePaymentSuccess}
                initialCourse={selectedCourse}
            />
        </div>
    );
};

export default MyCoursesPage;