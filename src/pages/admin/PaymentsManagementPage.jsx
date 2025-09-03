// src/pages/admin/PaymentsManagementPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, CircularProgress, Alert,
  Modal, Fade, Backdrop, IconButton, Avatar, useTheme, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminService from '../../services/adminService';
import SuccessPaymentModal from '../../components/admin/SuccessPaymentModal';
import './PaymentsManagementPage.css';

// المسار الصحيح لملف الصوت في مجلد public
const CHING_CHING_SOUND = `/ching_ching.mp3`;

const PaymentsManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // تهيئة كائن الصوت مرة واحدة لتجنب إعادة إنشائه مع كل render
  const audio = React.useMemo(() => new Audio(CHING_CHING_SOUND), []);

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
        
        // ✨ 1. تشغيل الصوت فوراً
        audio.play();

        // ✨ 2. تأخير ظهور النافذة المنبثقة لنصف ثانية
        setTimeout(() => {
            setIsSuccessModalOpen(true);
            setTimeout(() => {
                setIsSuccessModalOpen(false);
            }, 3000); // إغلاق النافذة بعد 3 ثوانٍ
        }, 500); // تأخير 500ms

      } else {
        await AdminService.rejectPayment(paymentId);
      }
      fetchPayments(); // تحديث القائمة
    } catch (err) {
      setError(err.response?.data?.error || `فشل في ${action === 'approve' ? 'الموافقة على' : 'رفض'} الدفعة.`);
    } finally {
      setProcessingId(null);
    }
  };

  // Mobile Card View Component
  const MobileCard = ({ payment }) => (
    <Paper className="payment-card" elevation={3}>
      <Box className="payment-card-header">
        <Avatar sx={{ bgcolor: 'primary.light' }}>{payment.user_name.charAt(0)}</Avatar>
        <Box>
          <Typography fontWeight="600">{payment.user_name}</Typography>
          <Typography variant="body2" color="text.secondary">{payment.course_title}</Typography>
        </Box>
      </Box>
      <Box className="payment-card-body">
        <div className="detail-item">
            <span className="label">المبلغ</span>
            <span className="value">{payment.amount} ج.م</span>
        </div>
        <div className="detail-item">
            <span className="label">التاريخ</span>
            <span className="value">{new Date(payment.created_at).toLocaleDateString('ar-EG')}</span>
        </div>
      </Box>
      <Box className="payment-card-footer">
        <Button 
            variant="outlined" 
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => handleOpenImageModal(payment.screenshot_path)}
        >
            عرض الإيصال
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="success" onClick={() => handleAction(payment.payment_id, 'approve')} disabled={processingId === payment.payment_id}>
                {processingId === payment.payment_id ? <CircularProgress size={20} color="success" /> : <CheckCircleIcon />}
            </IconButton>
            <IconButton color="error" onClick={() => handleAction(payment.payment_id, 'reject')} disabled={processingId === payment.payment_id}>
                {processingId === payment.payment_id ? <CircularProgress size={20} color="error" /> : <CancelIcon />}
            </IconButton>
        </Box>
      </Box>
    </Paper>
  );

  // Desktop Table View
  const DesktopTable = () => (
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
  );

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        معالجة المدفوعات
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {payments.length > 0 ? (
                  payments.map(p => <MobileCard key={p.payment_id} payment={p} />)
              ) : (
                  <Typography sx={{textAlign: 'center', p: 4}}>لا توجد مدفوعات معلقة حاليًا.</Typography>
              )}
          </Box>
      ) : (
          <DesktopTable />
      )}

      {/* Image Modal */}
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

      {/* Success Payment Modal */}
      <SuccessPaymentModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </Box>
  );
};

export default PaymentsManagementPage;