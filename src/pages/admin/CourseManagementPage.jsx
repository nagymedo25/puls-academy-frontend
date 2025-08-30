// src/pages/admin/CourseManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AdminService from '../../services/adminService';
import CourseTable from '../../components/admin/CourseTable';
import CourseFormModal from '../../components/admin/CourseFormModal';
// ✨ ١. استيراد المكون الجديد
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { keyframes } from '@emotion/react';

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
  
  // ✨ ٢. حالات جديدة لنافذة تأكيد الحذف
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);


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
    try {
      if (selectedCourse) {
        await AdminService.updateCourse(selectedCourse.course_id, courseData);
      } else {
        await AdminService.createCourse(courseData);
      }
      handleCloseModal();
      fetchCourses();
    } catch (err) {
      setError('فشل في حفظ الكورس.');
    } finally {
      setFormLoading(false);
    }
  };

  // ✨ ٣. دالة لفتح نافذة التأكيد
  const handleDeleteRequest = (courseId) => {
    setCourseToDelete(courseId);
    setConfirmModalOpen(true);
  };

  // ✨ ٤. دالة لإغلاق نافذة التأكيد
  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setCourseToDelete(null);
  };
  
  // ✨ ٥. دالة لتنفيذ الحذف بعد التأكيد
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setDeleteLoading(true);
    try {
      await AdminService.deleteCourse(courseToDelete);
      handleCloseConfirmModal();
      fetchCourses(); // تحديث القائمة
    } catch (err) {
      setError('فشل في حذف الكورس.');
      handleCloseConfirmModal(); // أغلق النافذة حتى في حالة الفشل
    } finally {
      setDeleteLoading(false);
    }
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
        // ✨ ٦. تمرير دالة handleDeleteRequest إلى الجدول
        <CourseTable courses={courses} onEdit={handleOpenModal} onDelete={handleDeleteRequest} />
      )}

      <CourseFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        course={selectedCourse}
        loading={formLoading}
      />
      
      {/* ✨ ٧. إضافة نافذة التأكيد إلى الصفحة */}
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من رغبتك في حذف هذا الكورس؟ سيتم حذف جميع الدروس والبيانات المتعلقة به بشكل نهائي ولا يمكن التراجع عن هذا الإجراء."
        loading={deleteLoading}
      />
    </Box>
  );
};

export default CourseManagementPage;