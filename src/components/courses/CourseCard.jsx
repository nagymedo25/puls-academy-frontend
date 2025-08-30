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

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const imageUrl = course.thumbnail_url;

  const handleCardClick = () => {
    navigate(`/course/${course.course_id}`); 
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        transition: 'transform 0.35s ease-in-out, box-shadow 0.35s ease-in-out',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardActionArea 
        onClick={handleCardClick} 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          // No padding here to allow the image to fill the top
          p: 0, 
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <Box
            component="img"
            src={imageUrl}
            alt={course.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease-in-out',
              // Apply hover effect through the parent CardActionArea
              '.MuiCardActionArea-root:hover &': {
                transform: 'scale(1.05)',
              }
            }}
          />
          <Chip
            icon={course.category === 'pharmacy' ? <SchoolIcon /> : <MedicalServicesIcon />}
            label={course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
            color="primary"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: alpha(theme.palette.primary.dark, 0.85),
              color: 'white',
              backdropFilter: 'blur(5px)',
              fontWeight: 'bold',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, width: '100%', p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 600, 
              flexGrow: 1, // Allow title to take up available space
              mb: 2,
              minHeight: '56px', // Ensures a consistent height for 2 lines of text
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {course.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant="h5" color="primary.dark" sx={{ fontWeight: 'bold' }}>
              {course.price} جنيه
            </Typography>
             <Typography variant="body2" color="text.secondary">
                {course.lessons_count || 0} درس
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={handleCardClick}
          sx={{
            py: 1.2,
            fontSize: '1rem',
            borderRadius: '12px',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          تفاصيل ومعاينة
        </Button>
      </Box>
    </Card>
  );
};

export default CourseCard;
