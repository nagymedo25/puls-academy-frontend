// src/components/admin/StudentTable.jsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Avatar, Box, Typography, Chip, useTheme, useMediaQuery, Button, Switch, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmationModal from '../common/ConfirmationModal';

const StudentTable = ({ students, onDetails, onEdit, onDelete, onStatusChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management for the modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionType, setActionType] = useState(''); // 'delete' or 'statusChange'

  const openModal = (student, type) => {
    setSelectedStudent(student);
    setActionType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setActionType('');
  };

  const handleConfirm = () => {
    if (actionType === 'delete' && selectedStudent) {
      onDelete(selectedStudent.user_id);
    } else if (actionType === 'statusChange' && selectedStudent) {
      const newStatus = selectedStudent.status === 'active' ? 'suspended' : 'active';
      onStatusChange(selectedStudent.user_id, newStatus);
    }
    closeModal();
  };

  // This function generates the correct content for the modal based on the action
  const getModalContent = () => {
    if (!selectedStudent) return {};
    if (actionType === 'delete') {
      return {
        title: 'تأكيد الحذف',
        message: `هل أنت متأكد أنك تريد حذف الطالب "${selectedStudent.name}" بشكل نهائي؟`,
        confirmText: 'نعم، قم بالحذف',
        color: 'error',
      };
    } else {
      const isActivating = selectedStudent.status !== 'active';
      return {
        title: isActivating ? 'تأكيد التفعيل' : 'تأكيد التعليق',
        message: `هل أنت متأكد أنك تريد ${isActivating ? 'تفعيل' : 'تعليق'} حساب الطالب "${selectedStudent.name}"؟`,
        confirmText: isActivating ? 'تفعيل' : 'تعليق الحساب',
        color: isActivating ? 'success' : 'warning',
      };
    }
  };

  const { title, message, confirmText, color } = getModalContent();

  const getAvatarContent = (name) => name ? name.charAt(0).toUpperCase() : '?';


  // Mobile Card View
  const MobileCard = ({ student, index }) => (
    <div className="student-card-wrapper" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="student-card-header">
        <Avatar sx={{ bgcolor: 'primary.main' }}>{getAvatarContent(student.name)}</Avatar>
        <Box>
          <Typography variant="h6" fontWeight="600">{student.name}</Typography>
          <Typography variant="body2" color="text.secondary">{student.email}</Typography>
        </Box>
      </div>
      <div className="student-card-body">
        <div className="student-card-detail">
          <span className="label">الكلية</span>
          <Chip label={student.college === 'pharmacy' ? 'صيدلة' : 'طب أسنان'} size="small" />
        </div>
        <div className="student-card-detail">
          <span className="label">تاريخ التسجيل</span>
          <span>{new Date(student.created_at).toLocaleDateString('ar-EG')}</span>
        </div>
      </div>
      <div className="student-card-footer">
        <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} onClick={() => onDetails(student)}>
          التفاصيل
        </Button>
        <IconButton onClick={() => onEdit(student)} color="primary"><EditIcon /></IconButton>
        <IconButton onClick={() => onDelete(student.user_id)} color="error"><DeleteIcon /></IconButton>
      </div>
    </div>
  );

  // Desktop Table View
  const DesktopTable = () => (
    <TableContainer component={Paper} className="responsive-student-table" sx={{ borderRadius: '16px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الطالب</TableCell>
            <TableCell>الكلية</TableCell>
            <TableCell>تاريخ التسجيل</TableCell>
            <TableCell align="center">الإجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.user_id} sx={{ '&:hover': { backgroundColor: '#f9fafb' }, animation: `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`, opacity: 0 }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>{getAvatarContent(student.name)}</Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="600">{student.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{student.email}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={student.college === 'pharmacy' ? 'صيدلة' : 'طب أسنان'} size="small" />
              </TableCell>
              <TableCell>{new Date(student.created_at).toLocaleDateString('ar-EG')}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => onDetails(student)} color="default"><VisibilityIcon /></IconButton>
                <IconButton onClick={() => onEdit(student)} color="primary"><EditIcon /></IconButton>
                <IconButton onClick={() => onDelete(student.user_id)} color="error"><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      {isMobile
        ? <Box>{students.map((student, index) => <MobileCard student={student} key={student.user_id} index={index} />)}</Box>
        : <DesktopTable />
      }
      <ConfirmationModal
        open={modalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        confirmText={confirmText}
        confirmButtonColor={color}
      />
    </>
  );

};

export default StudentTable;