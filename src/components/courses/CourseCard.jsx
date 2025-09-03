import React from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  
  const handleCardClick = (e) => {
    e.preventDefault();
    navigate(`/course/${course.course_id}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للعناصر الأصل
    navigate(`/course/${course.course_id}`);
  };

  return (
    <div className="course-card-reimagined">
      {/* قسم المحتوى القابل للنقر */}
      <div 
        className="card-clickable-area"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick(e);
          }
        }}
      >
        <figure className="card-thumbnail-container">
          <img src={course.thumbnail_url} alt={course.title} className="card-thumbnail"/>
          <div className="thumbnail-overlay-gradient" />
          <div className="category-chip">
            {course.category === 'pharmacy' ? <SchoolIcon /> : <MedicalServicesIcon />}
            {course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
          </div>
        </figure>
        
        <div className="card-content-area">
          <h3 className="card-title">
            {course.title}
          </h3>
          
          <div className="card-details-row">
            <div className="card-price">
              {course.price}
              <span className="currency"> جنيه</span>
            </div>
            <div className="card-lessons">
              {course.lessons_count || 0} درس
            </div>
          </div>
        </div>
      </div>
      
      {/* زر الإجراء (منفصل عن المنطقة القابلة للنقر) */}
      <div className="card-action-button-container">
        <button
          className="card-action-button"
          onClick={handleButtonClick}
          aria-label={`تفاصيل ومعاينة ${course.title}`}
        >
          <VisibilityIcon />
          تفاصيل ومعاينة
        </button>
      </div>
    </div>
  );
};

export default CourseCard;