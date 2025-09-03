// src/components/courses/CourseCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const imageUrl = course.thumbnail_url;
  
  const handleCardClick = () => {
    navigate(`/course/${course.course_id}`);
  };
  
  return (
    <div className="course-card-enhanced">
      <div className="course-card-action-area" onClick={handleCardClick}>
        <div className="course-card-thumbnail-wrapper">
          <img
            src={imageUrl}
            alt={course.title}
            className="course-card-thumbnail"
          />
          <div className="thumbnail-overlay" />
          <div className="course-card-category-chip">
            {course.category === 'pharmacy' ? <SchoolIcon /> : <MedicalServicesIcon />}
            {course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
          </div>
        </div>
        <div className="course-card-content">
          <h3 className="course-card-title">
            {course.title}
          </h3>
          <div className="course-card-details">
            <div className="course-card-price">
              {course.price}
              <span className="currency"> جنيه</span>
            </div>
            <div className="course-card-lessons">
              {course.lessons_count || 0} درس
            </div>
          </div>
        </div>
      </div>
      <button
        className="course-card-button"
        onClick={handleCardClick}
      >
        <VisibilityIcon />
        تفاصيل ومعاينة
      </button>
    </div>
  );
};

export default CourseCard;