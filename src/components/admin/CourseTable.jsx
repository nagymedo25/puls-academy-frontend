// src/components/admin/CourseTable.jsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Avatar, Box, Typography, Chip, useTheme, useMediaQuery, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; // أيقونة جديدة للدروس

// تم إضافة onManageLessons كخاصية جديدة
const CourseTable = ({ courses, onEdit, onDelete, onManageLessons }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mobile Card View
  const MobileCard = ({ course }) => (
    <div className="responsive-course-table mobile-card-wrapper">
      <div className="card-header">
        <Avatar variant="rounded" src={course.thumbnail_url} alt={course.title} sx={{ width: 56, height: 56 }} />
        <Typography variant="h6" fontWeight="600">{course.title}</Typography>
      </div>
      <div className="card-body">
        <div className="card-detail">
          <span className="label">القسم</span>
          <span className="value">
            <Chip
              icon={course.category === 'pharmacy' ? <SchoolIcon /> : <MedicalServicesIcon />}
              label={course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
              size="small"
              color={course.category === 'pharmacy' ? 'primary' : 'success'}
            />
          </span>
        </div>
        <div className="card-detail">
          <span className="label">السعر</span>
          <span className="value">{course.price} ج.م</span>
        </div>
        <div className="card-detail">
          <span className="label">الدروس</span>
          <span className="value">{course.lessons_count || 0}</span>
        </div>
      </div>
      <div className="card-footer">
        <Button variant="outlined" size="small" startIcon={<LibraryBooksIcon />} onClick={() => onManageLessons(course)}>
          الدروس
        </Button>
        <IconButton onClick={() => onEdit(course)} color="primary"><EditIcon /></IconButton>
        <IconButton onClick={() => onDelete(course.course_id)} color="error"><DeleteIcon /></IconButton>
      </div>
    </div>
  );

  // Desktop Table View
  const DesktopTable = () => (
    <TableContainer component={Paper} className="responsive-course-table" sx={{ borderRadius: '16px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الكورس</TableCell>
            <TableCell>القسم</TableCell>
            <TableCell>السعر</TableCell>
            <TableCell>عدد الدروس</TableCell>
            <TableCell align="center">الإجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.course_id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar variant="rounded" src={course.thumbnail_url} alt={course.title} />
                  <Typography variant="body1" fontWeight="600">{course.title}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  icon={course.category === 'pharmacy' ? <SchoolIcon /> : <MedicalServicesIcon />}
                  label={course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'}
                  size="small"
                  color={course.category === 'pharmacy' ? 'primary' : 'success'}
                />
              </TableCell>
              <TableCell>{course.price} ج.م</TableCell>
              <TableCell>{course.lessons_count || 0}</TableCell>
              <TableCell align="center">
                <Button variant="text" size="small" startIcon={<LibraryBooksIcon />} onClick={() => onManageLessons(course)}>
                  الدروس
                </Button>
                <IconButton onClick={() => onEdit(course)} color="primary"><EditIcon /></IconButton>
                <IconButton onClick={() => onDelete(course.course_id)} color="error"><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // يعرض عرض الجوال أو سطح المكتب بناءً على حجم الشاشة
  if (isMobile) {
    return (
      <Box>
        {courses.map(course => <MobileCard course={course} key={course.course_id} />)}
      </Box>
    );
  }

  return <DesktopTable />;
};

export default CourseTable;
