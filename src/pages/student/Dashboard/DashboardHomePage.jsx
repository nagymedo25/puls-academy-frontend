// src/pages/Student/Dashboard/DashboardHomePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Button, LinearProgress, Avatar } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AuthService from '../../../services/authService';
import CourseService from '../../../services/courseService';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StatCard = ({ title, value, icon, color }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '16px',
        backgroundColor: 'white',
        animation: `${fadeInUp} 0.6s ease-out`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 6,
        }
      }}
    >
      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="p" fontWeight="700">
          {value}
        </Typography>
      </Box>
      <Avatar sx={{
          backgroundColor: theme => theme.palette[color]?.light || theme.palette.grey[200],
          color: theme => theme.palette[color]?.dark || theme.palette.grey[700],
          width: 56,
          height: 56,
      }}>
        {icon}
      </Avatar>
    </Paper>
);

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const progress = Math.floor(Math.random() * 60) + 20; // Mock progress for now

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                    }
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>
                        {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            التقدم: {progress}%
                        </Typography>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                </Box>
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    startIcon={<PlayArrowIcon />}
                    onClick={() => navigate(`/courses/${course.course_id}`)}
                    sx={{ borderRadius: 0, py: 1.5, textTransform: 'none', fontSize: '1rem' }}
                >
                    بدء المشاهدة
                </Button>
            </Paper>
        </Grid>
    );
};


const DashboardHomePage = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user profile and courses in parallel
                const [profileResponse, coursesResponse] = await Promise.all([
                    AuthService.getProfile(),
                    CourseService.getAvailableCourses() // Assuming this fetches enrolled courses
                ]);
                // ✨ --- START: إصلاحات هنا --- ✨
                setUser(profileResponse.data.user);
                setCourses(coursesResponse.data.courses || []);
                // ✨ --- END: إصلاحات هنا --- ✨
            } catch (err) {
                setError('لم نتمكن من جلب بياناتك. يرجى المحاولة مرة أخرى.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, animation: `${fadeInUp} 0.4s ease-out` }}>
                أهلاً بعودتك، {user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
                نحن سعداء برؤيتك مرة أخرى. إليك ملخص سريع لنشاطك.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <StatCard 
                        title="الكورسات المسجلة" 
                        value={courses.length}
                        icon={<SchoolIcon fontSize="large"/>}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StatCard 
                        title="الشهادات المكتسبة" 
                        value="0" // Will be dynamic later
                        icon={<WorkspacePremiumIcon fontSize="large"/>}
                        color="warning"
                    />
                </Grid>
            </Grid>

            <Box mt={5} sx={{animation: `${fadeInUp} 0.7s ease-out`}}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    كورساتك الحالية
                </Typography>
                
                {courses.length > 0 ? (
                    <Grid container spacing={3}>
                        {courses.map(course => (
                            <CourseCard key={course.course_id} course={course} />
                        ))}
                    </Grid>
                ) : (
                    <Paper elevation={2} sx={{ p: 4, borderRadius: '16px', textAlign: 'center', mt: 2 }}>
                        <Typography color="text.secondary">لم تقم بالاشتراك في أي كورس بعد.</Typography>
                        <Button variant="contained" sx={{mt: 2}} onClick={() => navigate('/')}>
                            تصفح الكورسات
                        </Button>
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

export default DashboardHomePage;