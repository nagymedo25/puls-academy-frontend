// src/pages/admin/StudentManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import AdminService from '../../services/adminService';
import StudentTable from '../../components/admin/StudentTable';
import StudentDetailModal from '../../components/admin/StudentDetailModal';
import StudentFormModal from '../../components/admin/StudentFormModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import debounce from 'lodash.debounce';

import './StudentManagement.css'; 

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  
  // State for selected student
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // State for form/delete loading
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAllUsers();
      setStudents(response.data.users || []);
    } catch (err) {
      setError('فشل في جلب بيانات الطلاب.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      setLoading(true);
      try {
        if (query.trim() === '') {
          fetchStudents();
        } else {
          const response = await AdminService.searchUsers(query);
          setStudents(response.data.users || []);
        }
      } catch (err) {
        setError('فشل في البحث عن الطلاب.');
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (event) => {
    debouncedSearch(event.target.value);
  };
  
  // Modal Handlers
  const handleOpenDetails = (student) => {
    setSelectedStudent(student);
    setDetailModalOpen(true);
  };
  
  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setFormModalOpen(true);
  };

  const handleDeleteRequest = (studentId) => {
    setStudentToDelete(studentId);
    setConfirmModalOpen(true);
  };

  const handleCloseModals = () => {
    setDetailModalOpen(false);
    setFormModalOpen(false);
    setConfirmModalOpen(false);
    setSelectedStudent(null);
    setStudentToDelete(null);
  };

  const handleSaveStudent = async (formData) => {
    setFormLoading(true);
    try {
        await AdminService.updateUser(selectedStudent.user_id, formData);
        fetchStudents();
        handleCloseModals();
    } catch (err) {
        setError(err.response?.data?.error || 'فشل في تحديث بيانات الطالب.');
    } finally {
        setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
        await AdminService.deleteUser(studentToDelete);
        fetchStudents();
        handleCloseModals();
    } catch (err) {
        setError('فشل في حذف الطالب.');
    } finally {
        setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <div className="student-page-header">
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          إدارة الطلاب
        </Typography>
        <TextField
          label="ابحث بالاسم أو البريد الإلكتروني"
          variant="outlined"
          onChange={handleSearchChange}
          sx={{ width: { xs: '100%', sm: 350 } }}
        />
      </div>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        <StudentTable 
          students={students}
          onDetails={handleOpenDetails}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteRequest}
        />
      )}

      {selectedStudent && (
        <StudentDetailModal 
            open={detailModalOpen}
            onClose={handleCloseModals}
            student={selectedStudent}
        />
      )}

       {selectedStudent && (
        <StudentFormModal
            open={formModalOpen}
            onClose={handleCloseModals}
            onSave={handleSaveStudent}
            student={selectedStudent}
            loading={formLoading}
        />
      )}

      <ConfirmationModal
        open={confirmModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من رغبتك في حذف هذا الطالب؟ سيتم حذف جميع بياناته وكورساته ومدفوعاته بشكل نهائي."
        loading={deleteLoading}
      />
    </Box>
  );
};

export default StudentManagementPage;