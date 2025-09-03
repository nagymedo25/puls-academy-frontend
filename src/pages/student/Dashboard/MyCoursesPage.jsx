// src/pages/student/Dashboard/MyCoursesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CourseService from '../../../services/courseService';
import AuthService from '../../../services/authService';
import PaymentFormModal from '../../../components/student/PaymentFormModal';
import CourseDetailModal from '../../../components/student/CourseDetailModal';
import './MyCoursesPage.css';

const CourseStatusChip = ({ status }) => {
  const statusConfig = {
    active: { label: 'مفعّل', class: 'status-active', icon: <PlayCircleOutlineIcon /> },
    pending: { label: 'قيد المراجعة', class: 'status-pending', icon: <HourglassTopIcon /> },
    rejected: { label: 'مرفوض', class: 'status-rejected', icon: <ReportProblemIcon /> },
  };
  const config = statusConfig[status] || { label: status, class: '', icon: null };
  
  return (
    <div className={`course-status-chip ${config.class}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

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
      <div className="course-card-glow"></div>
      <div className="course-card">
        <div className="card-thumbnail-wrapper" onClick={() => onOpenDetails(course)}>
          <img src={course.thumbnail_url} alt={course.title} className="card-thumbnail" />
          {isEnrolled && (
            <div className="card-status-chip">
              <CourseStatusChip status={course.enrollment_status} />
            </div>
          )}
        </div>
        <div className="card-content-area">
          <h3 className="course-title" onClick={() => onOpenDetails(course)}>{course.title}</h3>
          <div className="course-category">
            <SchoolIcon />
            <span>{course.category === 'pharmacy' ? 'صيدلة' : 'طب الأسنان'}</span>
          </div>
          <div className="card-footer-details">
            <div className="lessons-count">{course.lessons_count || 0} درس</div>
            <button 
              className="card-action-button"
              onClick={handleButtonClick}
            >
              {isClickable ? <PlayCircleOutlineIcon /> : <VisibilityIcon />}
              {isClickable ? 'ابدأ المشاهدة' : 'عرض التفاصيل'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyCoursesPage = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const navigate = useNavigate();
  const particlesRef = useRef(null);
  
  // إنشاء جزيئات عائمة للخلفية
  const createParticles = () => {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // حجم عشوائي للجزيئات
      const size = Math.random() * 20 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // موضع عشوائي
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // تأخير عشوائي للأنيميشن
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
      
      particlesContainer.appendChild(particle);
    }
    
    return particlesContainer;
  };
  
  useEffect(() => {
    // إضافة الجزيئات العائمة عند تحميل المكون
    const pageElement = document.querySelector('.my-courses-page');
    if (pageElement) {
      particlesRef.current = createParticles();
      pageElement.appendChild(particlesRef.current);
    }
    
    // تنظيف الجزيئات عند إلغاء تحميل المكون
    return () => {
      if (pageElement && particlesRef.current && pageElement.contains(particlesRef.current)) {
        pageElement.removeChild(particlesRef.current);
      }
    };
  }, []);
  
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
  
  const handleBrowseAllCourses = () => {
    setShowAllCourses(true);
    // التمرير إلى أعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // تعديل دالة العودة للتأكد من عملها
  const handleBackToCurrent = () => {
    console.log("تم الضغط على زر العودة"); // للتأكد من استدعاء الدالة
    setShowAllCourses(false);
    // التمرير إلى أعلى الصفحة بسلاسة
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading) {
    return (
      <div className="my-courses-page">
        <div className="page-loader">
          <div className="pulsing-logo"></div>
          <p>جاري تحميل الكورسات...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="my-courses-page">
        <div className="page-error-alert">
          <h3>حدث خطأ</h3>
          <p>{error}</p>
          <button className="card-action-button" onClick={fetchCourses}>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="my-courses-page">
      {showAllCourses ? (
        <div className="all-courses-container">
          {/* زر العودة مع تعديلات لضمان عمله */}
          <div className="back-button-container">
            <button 
              className="back-button" 
              onClick={handleBackToCurrent}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBackToCurrent();
                }
              }}
              tabIndex={0}
              aria-label="العودة للكورسات الحالية"
            >
              <ArrowBackIcon />
              العودة للكورسات الحالية
            </button>
          </div>
          
          <h2 className="all-courses-title" style={{marginBottom: '90px'}}>جميع كورسات القسم</h2>
          
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
              <div className="empty-state-icon">
                <SchoolIcon style={{ fontSize: '3rem' }} />
              </div>
              <h3>لا توجد كورسات متاحة حالياً</h3>
              <p>نعمل على إضافة المزيد من الكورسات قريباً.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="dashboard-header">
            <div className="welcome-message-wrapper">
              <div className="welcome-icon">
                <SchoolIcon style={{ fontSize: '3.5rem' }} />
              </div>
              <h1 className="welcome-title">
                مرحباً بعودتك، {user?.name}!
                <span className="blinking-cursor"></span>
              </h1>
            </div>
            <p className="dashboard-subtitle">استكشف كورساتك المسجلة وتصفح الجديد في قسمك.</p>
          </div>
          
          <div>
            <h2 className="section-title" style={{marginBottom: '80px'}}>كورساتك الحالية</h2>
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
                <div className="empty-state-icon">
                  <SchoolIcon style={{ fontSize: '3rem' }} />
                </div>
                <h3>لم تشترك في أي كورس بعد.</h3>
                <p>الكورسات التي تقوم بشرائها ستظهر هنا.</p>
              </div>
            )}
          </div>
          
          <div className="available-courses-section">
            
            {/* زر تصفح جميع الكورسات - يظهر دائماً */}
            <div className="browse-all-container">
              <button className="browse-all-button" onClick={handleBrowseAllCourses}>
                تصفح جميع كورسات القسم
                <ArrowForwardIcon style={{ marginRight: '8px' }} />
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* مودال عرض تفاصيل الكورس */}
      <CourseDetailModal
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        course={selectedCourse}
        onBuyNow={handleBuyNow}
      />
      
      {/* مودال الدفع */}
      <PaymentFormModal 
        open={openPaymentModal} 
        onClose={() => { 
          setOpenPaymentModal(false); 
          setSelectedCourse(null); 
        }}
        onPaymentSuccess={handlePaymentSuccess}
        initialCourse={selectedCourse}
      />
    </div>
  );
};

export default MyCoursesPage;