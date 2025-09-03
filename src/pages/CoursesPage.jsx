// src/pages/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Grid,
  Paper,
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import CourseCard from '../components/courses/CourseCard';
import CourseService from '../services/courseService';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import { keyframes } from '@emotion/react';
import './CoursesPage.css';

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;
const backgroundPan = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- College Selection Component (nested) ---
const CollegeSelection = ({ onSelect, category }) => {
  const theme = useTheme();
  const categoryText = category === 'pharmacy' ? 'الصيدلة' : 'طب الأسنان';
  const choices = [
    { type: 'male', label: 'كلية البنين', icon: <ManIcon sx={{ fontSize: '5rem' }} />, color: theme.palette.primary.dark },
    { type: 'female', label: 'كلية البنات', icon: <WomanIcon sx={{ fontSize: '5rem' }} />, color: theme.palette.primary.main }
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.background.default}, ${alpha(theme.palette.primary.light, 0.1)})`,
        backgroundSize: '200% 200%',
        animation: `${backgroundPan} 15s ease infinite`,
        py: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeInUp} 0.8s ease-out` }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: 'primary.dark', mb: 2 }}>
            اختر مسارك في قسم {categoryText}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            تجربتك التعليمية تبدأ من هنا. اختر كليتك لاستعراض الكورسات المتاحة لك.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 4, md: 8 }} justifyContent="center">
          {choices.map((choice, index) => (
            <Grid xs={12} md={5} key={choice.type} sx={{
              animation: `${fadeInUp} 0.8s ease-out ${0.2 + index * 0.2}s`,
              animationFillMode: 'both',
            }}>
              <Paper
                onClick={() => onSelect(choice.type)}
                elevation={4}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid transparent',
                  background: `linear-gradient(145deg, ${alpha(choice.color, 0.05)}, ${alpha(choice.color, 0.15)})`,
                  backdropFilter: 'blur(15px)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05) rotate(1deg)',
                    borderColor: choice.color,
                    boxShadow: `0 0 40px ${alpha(choice.color, 0.4)}`,
                    '& .choice-icon': {
                      transform: 'scale(1.15) rotate(5deg)',
                      color: choice.color,
                    },
                    '& .choice-title': {
                        color: choice.color,
                    }
                  },
                }}
              >
                <Box
                  className="choice-icon"
                  sx={{
                    fontSize: '6rem',
                    color: alpha(theme.palette.text.primary, 0.7),
                    transition: 'transform 0.3s ease, color 0.3s ease',
                    mb: 2,
                  }}
                >
                  {choice.icon}
                </Box>
                <Typography
                  className="choice-title"
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    transition: 'color 0.3s ease',
                    color: 'text.primary',
                  }}
                >
                  {choice.label}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  اضغط هنا لعرض الكورسات المخصصة
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// --- Courses List Component (nested) ---
const CoursesList = ({ category, collegeType }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
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
    <Box sx={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.05)}, ${theme.palette.background.default} 30%)`,
    }}>
        <Container maxWidth="xl" sx={{ py: 6, animation: `${fadeInUp} 0.8s ease-out`, zIndex: 1, position: 'relative' }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                كورسات {categoryText} - كلية {collegeText}
            </Typography>
            
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress size={60} /></Box>
        ) : error ? (
            <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
        ) : (
            <div className="courses-grid">
            {courses.length > 0 ? (
                courses.map((course, index) => (
                <div 
                  key={course.course_id} 
                  className="course-card-container"
                  style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s`, animationFillMode: 'both' }}
                >
                    <CourseCard course={course} />
                </div>
                ))
            ) : (
                <div className="no-courses-message">
                    <Typography variant="h6" sx={{mb: 2}}>
                        لا توجد كورسات متاحة حاليًا
                    </Typography>
                    <Typography color="text.secondary">
                        نعمل على إضافة المزيد من الكورسات قريباً.
                    </Typography>
                </div>
            )}
            </div>
        )}
        </Container>
    </Box>
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
      <Box sx={{ backgroundColor: 'background.default', minHeight: 'calc(100vh - 128px)' }}>
        {!selectedCollege ? (
          <CollegeSelection onSelect={handleCollegeSelect} category={category} />
        ) : (
          <CoursesList category={category} collegeType={selectedCollege} />
        )}
      </Box>
      <Footer />
    </>
  );
};

export default CoursesPage;