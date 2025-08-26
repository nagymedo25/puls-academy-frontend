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

  // --- استخدام الرابط الحقيقي للصورة المصغرة من الـ API ---
  const imageUrl = course.thumbnail_url || `https://placehold.co/600x400/F91C45/FFFFFF?text=${encodeURIComponent(course.title)}`;

  const handleCardClick = () => {
    // navigate(`/courses/${course.course_id}`); // جاهز للتفعيل لاحقًا
    console.log(`Navigating to course ${course.course_id}`);
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
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0, alignItems: 'flex-start' }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box
            component="img"
            src={imageUrl} // <-- هنا يتم استخدام الرابط الصحيح
            alt={course.title}
            sx={{
              height: 180,
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease-in-out',
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
              backgroundColor: alpha(theme.palette.primary.dark, 0.8),
              color: 'white',
              backdropFilter: 'blur(4px)',
              fontWeight: 'bold',
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, width: '100%', p: 2.5 }}>
          <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 600, minHeight: { xs: 'auto', md: '64px' }, mb: 2 }}>
            {course.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" color="primary.dark" sx={{ fontWeight: 'bold' }}>
              {course.price} جنيه
            </Typography>
             <Typography variant="body2" color="text.secondary">
                {course.lessons_count || 0} درس
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2.5, pt: 0 }}>
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