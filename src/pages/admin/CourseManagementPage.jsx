// src/pages/admin/CourseManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Modal, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminService from '../../services/adminService';
import CourseTable from '../../components/admin/CourseTable';
import CourseFormModal from '../../components/admin/CourseFormModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { keyframes } from '@emotion/react';

// ✨ 1. استيراد المكون الجديد لإدارة الدروس
import LessonManager from '../../components/admin/LessonManager'; 

import './CourseManagement.css'; 

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✨ 2. حالات جديدة لنافذة إدارة الدروس
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState(null);


  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAllCourses();
      setCourses(response.data.courses || []);
    } catch (err) {
      setError('فشل في جلب الكورسات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (course = null) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleSaveCourse = async (courseData) => {
    setFormLoading(true);
    setError(''); // مسح الأخطاء القديمة
    try {
      if (selectedCourse) {
        await AdminService.updateCourse(selectedCourse.course_id, courseData);
      } else {
        await AdminService.createCourse(courseData);
      }
      handleCloseModal();
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRequest = (courseId) => {
    setCourseToDelete(courseId);
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setCourseToDelete(null);
  };
  
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setDeleteLoading(true);
    try {
      await AdminService.deleteCourse(courseToDelete);
      handleCloseConfirmModal();
      fetchCourses(); // تحديث القائمة
    } catch (err) {
      setError('فشل في حذف الكورس.');
      handleCloseConfirmModal();
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✨ 3. دوال لفتح وإغلاق نافذة إدارة الدروس
  const handleOpenLessonManager = (course) => {
    setSelectedCourseForLessons(course);
    setIsLessonModalOpen(true);
  };

  const handleCloseLessonManager = () => {
    setIsLessonModalOpen(false);
    setSelectedCourseForLessons(null);
    fetchCourses(); // ✨ تحديث عدد الدروس في الجدول عند إغلاق النافذة
  };


  return (
    <Box sx={{ animation: `${fadeInUp} 0.5s ease-out`}}>
      <div className="course-page-header">
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          إدارة الكورسات
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          إضافة كورس جديد
        </Button>
      </div>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        // ✨ 4. تمرير دالة فتح نافذة الدروس إلى الجدول
        <CourseTable 
          courses={courses} 
          onEdit={handleOpenModal} 
          onDelete={handleDeleteRequest}
          onManageLessons={handleOpenLessonManager} 
        />
      )}

      {/* نافذة تعديل/إضافة الكورس (تبقى كما هي) */}
      <CourseFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        course={selectedCourse}
        loading={formLoading}
      />
      
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من رغبتك في حذف هذا الكورس؟ سيتم حذف جميع الدروس والبيانات المتعلقة به بشكل نهائي ولا يمكن التراجع عن هذا الإجراء."
        loading={deleteLoading}
      />

      {/* ✨ 5. إضافة نافذة إدارة الدروس الجديدة */}
      {selectedCourseForLessons && (
        <Modal open={isLessonModalOpen} onClose={handleCloseLessonManager}>
            <Paper sx={{ p: 4, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', md: '700px' }, maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }}>
                <Typography variant="h5" mb={3} fontWeight="700">إدارة دروس: {selectedCourseForLessons.title}</Typography>
                <LessonManager courseId={selectedCourseForLessons.course_id} />
            </Paper>
        </Modal>
      )}
    </Box>
  );
};

export default CourseManagementPage;