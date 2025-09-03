// src/pages/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import CourseCard from '../components/courses/CourseCard';
import CourseService from '../services/courseService';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

// استيراد ملف التصميم الجديد المعتمد على CSS النقي
import './CourseDetailPage.css';

// --- College Selection Component (nested & refactored) ---
const CollegeSelection = ({ onSelect, category }) => {
    const categoryText = category === 'pharmacy' ? 'الصيدلة' : 'طب الأسنان';
    const choices = [
      { type: 'male', label: 'كلية البنين', icon: <ManIcon style={{ fontSize: '5rem' }} /> },
      { type: 'female', label: 'كلية البنات', icon: <WomanIcon style={{ fontSize: '5rem' }} /> }
    ];
  
    return (
      <section className="college-selection-container">
        <div className="college-selection-content">
          <header className="college-selection-header">
            <h1>اختر مسارك في قسم {categoryText}</h1>
            <p>تجربتك التعليمية تبدأ من هنا. اختر كليتك لاستعراض الكورسات المتاحة لك.</p>
          </header>
  
          <div className="college-choices-grid">
            {choices.map((choice, index) => (
              <div
                key={choice.type}
                className="college-choice-card"
                onClick={() => onSelect(choice.type)}
                style={{ animationDelay: `${0.2 + index * 0.2}s` }}
              >
                <div className="choice-card-icon">{choice.icon}</div>
                <h2 className="choice-card-title">{choice.label}</h2>
                <p className="choice-card-subtitle">اضغط هنا لعرض الكورسات المخصصة</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
};

// --- Courses List Component (nested & refactored) ---
const CoursesList = ({ category, collegeType }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const categoryText = category === 'pharmacy' ? 'الصيدلة' : 'طب الأسنان';
  const collegeText = collegeType === 'male' ? 'البنين' : 'البنات';

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await CourseService.getAllCourses({ category });
        setCourses(response.data.courses || []);
      } catch (err) {
        setError('حدث خطأ أثناء جلب الكورسات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [category, collegeType]);

  return (
    <section className="courses-list-section">
      <div className="courses-list-container">
        <h2 className="courses-list-header">
          كورسات {categoryText} - كلية {collegeText}
        </h2>

        {loading ? (
          <div className="centered-message-container">
            <div className="loader-spinner"></div>
          </div>
        ) : error ? (
          <div className="alert-message">{error}</div>
        ) : (
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div key={course.course_id} className="course-card-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div className="no-courses-message">
                <h3>لا توجد كورسات متاحة حاليًا</h3>
                <p>نعمل على إضافة المزيد من الكورسات قريباً.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

// --- Main Page Component ---
const CoursesPage = () => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');

  useEffect(() => {
    if (!category || (category !== 'pharmacy' && category !== 'dentistry')) {
      navigate('/');
    }
  }, [category, navigate]);

  const handleCollegeSelect = (collegeType) => {
    setSelectedCollege(collegeType);
  };

  if (!category) {
    return null; 
  }

  return (
    <>
      <Header />
      <main>
        {!selectedCollege ? (
          <CollegeSelection onSelect={handleCollegeSelect} category={category} />
        ) : (
          <CoursesList category={category} collegeType={selectedCollege} />
        )}
      </main>
      <Footer />
    </>
  );
};

export default CoursesPage;