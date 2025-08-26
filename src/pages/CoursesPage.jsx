// src/pages/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import CourseCard from '../components/courses/CourseCard';
import CourseService from '../services/courseService';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import { keyframes } from '@emotion/react';

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(15px, -15px); }
  100% { transform: translate(0, 0); }
`;

const AbstractShape = ({ sx }) => (
  <Box
    sx={{
      position: 'absolute',
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      background: (theme) => `linear-gradient(45deg, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
      animation: `${float} 15s ease-in-out infinite alternate`,
      ...sx,
    }}
  />
);

// --- College Selection Component ---
const CollegeSelection = ({ onSelect, category }) => {
  const theme = useTheme();
  const categoryText = category === 'pharmacy' ? 'الصيدلة' : 'طب الأسنان';

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <AbstractShape sx={{ width: 250, height: 250, top: '-50px', left: '-80px' }} />
      <AbstractShape sx={{ width: 150, height: 150, bottom: '10%', right: '-50px', animationDuration: '10s' }} />
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', zIndex: 1, position: 'relative' }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, color: 'primary.dark', mb: 2, animation: `${fadeInUp} 0.6s ease-out` }}>
          قسم {categoryText}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 6, animation: `${fadeInUp} 0.6s ease-out 0.2s` }}>
          نحن نخصص التجربة الأفضل لك. الرجاء اختيار كليتك.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { type: 'male', label: 'كلية البنين', icon: <ManIcon sx={{ fontSize: 80, color: 'primary.main' }} />, delay: '0.4s' },
            { type: 'female', label: 'كلية البنات', icon: <WomanIcon sx={{ fontSize: 80, color: 'primary.light' }} />, delay: '0.6s' }
          ].map(item => (
            <Grid item xs={12} sm={6} md={5} key={item.type}>
              <Card 
                sx={{ 
                  borderRadius: '20px', 
                  animation: `${fadeInUp} 0.6s ease-out ${item.delay}`,
                  animationFillMode: 'both',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.03)',
                    boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.2)}`,
                  }
                }}
              >
                <CardActionArea onClick={() => onSelect(item.type)} sx={{ p: {xs: 3, sm: 5} }}>
                  {item.icon}
                  <CardContent>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// --- Courses List Component ---
const CoursesList = ({ category }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const categoryText = category === 'pharmacy' ? 'الصيدلة' : 'طب الأسنان';

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
  }, [category]);

  return (
    <Container maxWidth="lg" sx={{ py: 6, animation: `${fadeInUp} 0.8s ease-out` }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
            كورسات {categoryText}
        </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      ) : (
        <Grid container spacing={4}>
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={course.course_id}>
                 <Box sx={{ animation: `${fadeInUp} 0.5s ease-out ${index * 0.1}s`, animationFillMode: 'both' }}>
                    <CourseCard course={course} />
                 </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography sx={{ textAlign: 'center', p: 5, color: 'text.secondary', fontSize: '1.2rem' }}>
                لا توجد كورسات متاحة حاليًا في هذا القسم.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

// --- Main Page Component ---
const CoursesPage = () => {
  const [collegeSelected, setCollegeSelected] = useState(false);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') === 'dentistry' ? 'dentistry' : 'pharmacy';

  const handleCollegeSelect = () => {
    setCollegeSelected(true);
  };

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: 'background.default', minHeight: 'calc(100vh - 128px)' }}>
        {!collegeSelected ? (
          <CollegeSelection onSelect={handleCollegeSelect} category={category} />
        ) : (
          <CoursesList category={category} />
        )}
      </Box>
      <Footer />
    </>
  );
};

export default CoursesPage;