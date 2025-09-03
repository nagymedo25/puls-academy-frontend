// src/components/courses/CourseCard.jsx
import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Button,
  alpha,
  useTheme,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

// ✨ 1. استيراد ملف الـ CSS المحدث
import './CourseCard.css';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const imageUrl = course.thumbnail_url;

  const handleCardClick = () => {
    navigate(`/course/${course.course_id}`);
  };

  return (
    // ✨ 2. تطبيق الكلاس الرئيسي المحدث
    <Card className="course-card-enhanced">
      <CardActionArea onClick={handleCardClick} className="course-card-action-area">
        <Box className="course-card-thumbnail-wrapper">
          <Box
            component="img"
            src={imageUrl}
            alt={course.title}
            className="course-card-thumbnail"
          />
           <div className="thumbnail-overlay" />
          <Chip
            icon={course.category === 'pharmacy' ? <SchoolIcon /> : <MedicalServicesIcon />}
            label={course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
            color="primary"
            className="course-card-category-chip"
            sx={{
              backgroundColor: alpha(theme.palette.primary.dark, 0.9),
              backdropFilter: 'blur(8px)',
            }}
          />
        </Box>
        <CardContent className="course-card-content">
          <Typography gutterBottom variant="h5" component="h3" className="course-card-title">
            {course.title}
          </Typography>
          <Box className="course-card-details">
            <Typography variant="h4" color="primary.dark" className="course-card-price">
              {course.price}
              <span className="currency"> جنيه</span>
            </Typography>
             <Typography variant="body1" color="text.secondary" className="course-card-lessons">
                {course.lessons_count || 0} درس
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={handleCardClick}
          className="course-card-button"
        >
          تفاصيل ومعاينة
        </Button>
      </Box>
    </Card>
  );
};

export default CourseCard;