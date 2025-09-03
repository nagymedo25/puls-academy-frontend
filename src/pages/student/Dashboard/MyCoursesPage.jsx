// src/pages/student/Dashboard/MyCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Button, Chip, Divider } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility'; // ✨ أيقونة جديدة
import CourseService from '../../../services/courseService';
import AuthService from '../../../services/authService';
import PaymentFormModal from '../../../components/student/PaymentFormModal'; // ✨ استيراد مودال الدفع
import CourseDetailModal from '../../../components/student/CourseDetailModal'; // ✨ استيراد مودال التفاصيل الجديد
import './MyCourses.css';

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

const CourseCard = ({ course, delay, onOpenDetails }) => { // ✨ إضافة onOpenDetails
    const navigate = useNavigate();
    const isEnrolled = course.enrollment_status !== 'available';
    const isClickable = course.enrollment_status === 'active';

    const handleButtonClick = (e) => {
        e.stopPropagation(); // منع النقر على البطاقة بالكامل
        if (isClickable) {
            navigate(`/course/${course.course_id}/watch`);
        } else {
            onOpenDetails(course); // ✨ فتح المودال
        }
    };

    return (
        <Grid item xs={12} md={6} lg={4}>
            <Paper className="enrolled-course-card" sx={{ animationDelay: `${delay}s` }}> {/* إزالة cursor: pointer من هنا */}
                <Box className="card-thumbnail-wrapper" onClick={() => onOpenDetails(course)}> {/* إضافة onClick هنا لفتح التفاصيل */}
                    <img src={course.thumbnail_url} alt={course.title} />
                    <div className="card-overlay" />
                    {isEnrolled && (
                        <div className="card-status-chip">
                            <CourseStatusChip status={course.enrollment_status} />
                        </div>
                    )}
                </Box>
                <Box className="card-content-wrapper">
                    <Typography variant="h6" className="course-title" onClick={() => onOpenDetails(course)} sx={{cursor: 'pointer'}}>{course.title}</Typography>
                    <Typography variant="body2" className="course-category">
                        <SchoolIcon /> {course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
                    </Typography>
                    <div className="card-footer">
                        <Typography variant="body2" className="lessons-count">{course.lessons_count || 0} درس</Typography>
                        <Button 
                            size="small" 
                            variant="contained" 
                            startIcon={isClickable ? <PlayCircleOutlineIcon /> : <VisibilityIcon />} // ✨ أيقونة جديدة
                            onClick={handleButtonClick}
                        >
                            {isClickable ? 'ابدأ المشاهدة' : 'عرض التفاصيل'}
                        </Button>
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
    const [openDetailModal, setOpenDetailModal] = useState(false); // ✨ حالة لفتح مودال التفاصيل
    const [selectedCourse, setSelectedCourse] = useState(null);    // ✨ الكورس المحدد لعرض تفاصيله
    const [openPaymentModal, setOpenPaymentModal] = useState(false); // ✨ حالة لفتح مودال الدفع

    const navigate = useNavigate();

    const fetchCourses = async () => { // ✨ دالة لجلب الكورسات لإعادة استخدامها
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

    // ✨ فتح مودال التفاصيل
    const handleOpenDetailModal = (course) => {
        setSelectedCourse(course);
        setOpenDetailModal(true);
    };

    // ✨ إغلاق مودال التفاصيل
    const handleCloseDetailModal = () => {
        setOpenDetailModal(false);
        setSelectedCourse(null);
    };

    // ✨ فتح مودال الدفع وتعبئة بيانات الكورس
    const handleBuyNow = (course) => {
        setSelectedCourse(course); // تحديد الكورس للمودال الدفع
        setOpenDetailModal(false); // إغلاق مودال التفاصيل
        setOpenPaymentModal(true);  // فتح مودال الدفع
    };

    // ✨ بعد نجاح الدفع، أعد جلب الكورسات وتحديث الواجهة
    const handlePaymentSuccess = () => {
        setOpenPaymentModal(false);
        setSelectedCourse(null);
        fetchCourses(); // إعادة جلب الكورسات لتحديث الحالة
    };


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
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>استكشف كورساتك المسجلة وتصفح الجديد في قسمك.</Typography>
            </Box>
            
            <Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 3 }}>كورساتك الحالية</Typography>
                {enrolledCourses.length > 0 ? (
                    <Grid container spacing={4}>
                        {enrolledCourses.map((course, index) => (
                            <CourseCard 
                                key={course.course_id} 
                                course={course} 
                                delay={0.1 * (index + 1)}
                                onOpenDetails={handleOpenDetailModal} // ✨ تمرير الدالة لفتح التفاصيل
                            />
                        ))}
                    </Grid>
                ) : (
                    <Paper sx={{ p: 5, textAlign: 'center', animation: `${fadeInUp} 0.6s ease-out` }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>لم تشترك في أي كورس بعد.</Typography>
                        <Typography color="text.secondary">الكورسات التي تقوم بشرائها ستظهر هنا.</Typography>
                    </Paper>
                )}
            </Box>
            
            <Box sx={{ mt: 6 }}>
                <Divider sx={{ my: 5, '&::before, &::after': { borderColor: 'primary.main' } }}>
                    <Chip label="تصفح كورسات القسم" />
                </Divider>
                {availableCourses.length > 0 ? (
                    <Grid container spacing={4}>
                        {availableCourses.map((course, index) => (
                            <CourseCard 
                                key={course.course_id} 
                                course={course} 
                                delay={0.1 * (index + 1)}
                                onOpenDetails={handleOpenDetailModal} // ✨ تمرير الدالة لفتح التفاصيل
                            />
                        ))}
                    </Grid>
                ) : (
                    <Paper sx={{ p: 5, textAlign: 'center' }}>
                        <Typography color="text.secondary">لا توجد كورسات أخرى متاحة في قسمك حالياً.</Typography>
                    </Paper>
                )}
            </Box>

            {/* ✨ مودال عرض تفاصيل الكورس */}
            <CourseDetailModal
                open={openDetailModal}
                onClose={handleCloseDetailModal}
                course={selectedCourse}
                onBuyNow={handleBuyNow} // ✨ تمرير دالة "اشترِ الآن"
            />

            {/* ✨ مودال الدفع (سيتم تعبئة الكورس تلقائياً إذا كان selectedCourse موجوداً) */}
            <PaymentFormModal 
                open={openPaymentModal} 
                onClose={() => { setOpenPaymentModal(false); setSelectedCourse(null); }}
                onPaymentSuccess={handlePaymentSuccess}
                initialCourse={selectedCourse} // ✨ تمرير الكورس المحدد مسبقاً
            />
        </Box>
    );
};

export default MyCoursesPage;