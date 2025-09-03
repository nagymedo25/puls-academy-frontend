// src/pages/student/CourseWatchPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Logo from "../../assets/logo2.png";

// Services
import CourseService from "../../services/courseService";

// CSS
import "./CourseWatchPage.css";

// ====================================================================
// 🛡️ --- START: Content Security System (Manual Resume) --- 🛡️
// ====================================================================
const useContentSecurity = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // This function ONLY blocks the content and does not unblock it automatically.
      if (document.hidden) {
        setIsBlocked(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Expose the setter function so the UI can use it.
  return { isBlocked, setIsBlocked };
};
// ====================================================================
// --- END: Content Security System ---
// ====================================================================

const Loader = () => (
  <div className="cw-page-loader-container">
    <div className="loader-spinner"></div>
    <p>جارٍ تحميل الكورس والدروس...</p>
  </div>
);

const SecurityWarning = ({ message, onAcknowledge }) => (
  <div className="security-warning-inline">
    <VisibilityOffOutlinedIcon style={{ fontSize: "5rem", color: "#A0A0A0" }} />
    <h2>تم إيقاف العرض مؤقتاً</h2>
    <p>{message}</p>
    <button onClick={onAcknowledge}>استئناف الدرس</button>
  </div>
);

// Main Component
const CourseWatchPage = () => {
  const { isBlocked, setIsBlocked } = useContentSecurity();
  const [showInitialPopup, setShowInitialPopup] = useState(true);

  const { courseId } = useParams();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 900);

  const getBunnyEmbedUrl = useCallback((playUrl) => {
    if (!playUrl || !playUrl.includes("mediadelivery.net/play")) return "";
    try {
      const embedUrl = new URL(playUrl.replace("/play/", "/embed/"));
      embedUrl.searchParams.set("autoplay", "true");
      return embedUrl.toString();
    } catch (e) {
      console.error("Could not parse Bunny.net URL", e);
      return "";
    }
  }, []);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseRes, lessonsRes] = await Promise.all([
          CourseService.getCourseById(courseId),
          CourseService.getCourseLessons(courseId),
        ]);
        setCourse(courseRes.data.course);
        const fetchedLessons = lessonsRes.data.lessons;
        setLessons(fetchedLessons);
        if (fetchedLessons?.length > 0) {
          setCurrentLesson(fetchedLessons[0]);
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "فشل في تحميل بيانات الكورس. قد لا يكون لديك صلاحية الوصول."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [courseId]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="cw-page-error-container">
        <div className="error-alert">
          <p>{error}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/dashboard")}>
          العودة للوحة التحكم
        </button>
      </div>
    );
  }

  return (
    <div className="cw-page-scoped-container">
      {showInitialPopup && (
        <div className="security-overlay">
          <div className="security-message-box">
            <InfoOutlinedIcon style={{ fontSize: "5rem", color: "#3399FF" }} />
            <h2>مرحباً بك في الدرس</h2>
            <p>
              للحفاظ على تركيزك وحماية المحتوى، سيتم إيقاف الفيديو مؤقتاً عند
              الانتقال إلى نافذة أخرى.
            </p>
            <button onClick={() => setShowInitialPopup(false)}>
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}

      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sidebar-toggle-button"
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div
          className="sidebar-header"
          onClick={() => navigate("/dashboard")}
          role="button"
        >
          <img src={Logo} alt="Logo" className="sidebar-logo" />
        </div>
        <div className="sidebar-course-info">
          <h2 className="sidebar-course-title">{course?.title}</h2>
          {lessons.length > 0 && (
            <p className="lesson-count">{lessons.length} درس</p>
          )}
        </div>
        <ul className="lesson-list">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <li
                key={lesson.lesson_id}
                className={`lesson-list-item ${
                  currentLesson?.lesson_id === lesson.lesson_id
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleLessonClick(lesson)}
                role="button"
                tabIndex={0}
              >
                <div className="lesson-details">
                  <span className="lesson-icon">
                    {currentLesson?.lesson_id === lesson.lesson_id ? (
                      <PlayCircleFilledWhiteIcon style={{ color: "#F91C45" }} />
                    ) : (
                      <CircleOutlinedIcon />
                    )}
                  </span>
                  <span className="lesson-title-text">{lesson.title}</span>
                </div>
                <span className="lesson-duration"></span>
              </li>
            ))
          ) : (
            <p className="no-lessons-message">
              لا توجد دروس في هذا الكورس بعد.
            </p>
          )}
        </ul>
        <div className="sidebar-footer">
          <button
            className="back-to-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowBackIcon />
            <span>العودة إلى لوحة التحكم</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {isBlocked ? (
          <SecurityWarning
            message="لقد غادرت الصفحة. لاستئناف المشاهدة، يرجى الضغط على الزر أدناه."
            onAcknowledge={() => setIsBlocked(false)}
          />
        ) : currentLesson ? (
          <>
            <h1 className="current-lesson-title">{currentLesson.title}</h1>
            <div className="video-player-wrapper">
              <iframe
                src={getBunnyEmbedUrl(currentLesson.video_url)}
                loading="eager"
                title={currentLesson.title}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
              ></iframe>
            </div>
            <div className="lesson-description-box">
              <h3>وصف الدرس</h3>
              <p>{currentLesson.description || "لا يوجد وصف لهذا الدرس."}</p>
            </div>
          </>
        ) : (
          <div className="no-lesson-selected">
            <h6>يرجى اختيار درس للبدء بالمشاهدة.</h6>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseWatchPage;
