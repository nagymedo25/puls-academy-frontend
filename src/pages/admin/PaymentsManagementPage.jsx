// src/pages/admin/PaymentsManagementPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert,
  Modal, Fade, Backdrop, IconButton // ✨ 1. استيراد المكونات الجديدة
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close'; // ✨ أيقونة للإغلاق
import AdminService from '../../services/adminService';

const PaymentsManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // ✨ 2. حالات جديدة للتحكم في النافذة المنبثقة والصورة المعروضة
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getPendingPayments();
      setPayments(response.data.payments || []);
    } catch (err) {
      setError('فشل في جلب المدفوعات المعلقة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✨ 3. دوال لفتح وإغلاق النافذة
  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage('');
  };


  const handleAction = async (paymentId, action) => {
    setProcessingId(paymentId);
    try {
      if (action === 'approve') {
        await AdminService.approvePayment(paymentId);
      } else {
        await AdminService.rejectPayment(paymentId);
      }
      fetchPayments();
    } catch (err) {
      setError(`فشل في ${action === 'approve' ? 'الموافقة على' : 'رفض'} الدفعة.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        معالجة المدفوعات
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper} sx={{ borderRadius: '16px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>اسم الطالب</TableCell>
              <TableCell>اسم الكورس</TableCell>
              <TableCell>صورة الإيصال</TableCell>
              <TableCell>المبلغ</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell>{payment.user_name}</TableCell>
                  <TableCell>{payment.course_title}</TableCell>
                  <TableCell>
                    {/* ✨ 4. تحويل الرابط إلى زر يفتح النافذة */}
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleOpenImageModal(payment.screenshot_path)}
                    >
                      عرض الصورة
                    </Button>
                  </TableCell>
                  <TableCell>{payment.amount} جنيه</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        disabled={processingId === payment.payment_id}
                        onClick={() => handleAction(payment.payment_id, 'approve')}
                      >
                        {processingId === payment.payment_id ? <CircularProgress size={20} /> : 'موافقة'}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        disabled={processingId === payment.payment_id}
                        onClick={() => handleAction(payment.payment_id, 'reject')}
                      >
                         {processingId === payment.payment_id ? <CircularProgress size={20} /> : 'رفض'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  لا توجد مدفوعات معلقة حاليًا.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✨ 5. إضافة النافذة المنبثقة لعرض الصورة */}
      <Modal
        open={isImageModalOpen}
        onClose={handleCloseImageModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
        }}
      >
        <Fade in={isImageModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 'none',
            p: 1,
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: 24,
          }}>
             <IconButton 
                onClick={handleCloseImageModal} 
                sx={{ 
                    position: 'absolute', 
                    top: -15, 
                    right: -15, 
                    zIndex: 1, 
                    color: 'white', 
                    backgroundColor: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.dark'
                    }
                }}
            >
                <CloseIcon />
            </IconButton>
            <img 
                src={selectedImage} 
                alt="إيصال الدفع" 
                style={{ 
                    maxHeight: '85vh', 
                    maxWidth: '85vw', 
                    display: 'block',
                    borderRadius: '12px' 
                }} 
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default PaymentsManagementPage;