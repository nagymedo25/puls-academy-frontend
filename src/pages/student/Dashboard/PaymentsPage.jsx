// src/pages/student/Dashboard/PaymentsPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Button, Tabs, Tab, Chip } from '@mui/material';
import { keyframes } from '@emotion/react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import PaymentService from '../../../services/paymentService';
import PaymentFormModal from '../../../components/student/PaymentFormModal'; // سنقوم بإنشائه لاحقاً
import './PaymentsPage.css';

// Keyframes for animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, -10px) rotate(10deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

// Abstract shape component
const AbstractShape = ({ sx }) => (
  <Box
    sx={{
      position: 'absolute',
      borderRadius: '30% 70% 50% 50% / 50% 30% 70% 50%',
      background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.light}1A, ${theme.palette.primary.main}1A)`,
      animation: `${float} 20s ease-in-out infinite alternate`,
      ...sx,
    }}
  />
);

const PaymentStatusChip = ({ status }) => {
    const statusConfig = {
      approved: { label: 'مقبول', color: 'success', icon: <CheckCircleIcon /> },
      pending: { label: 'قيد المراجعة', color: 'warning', icon: <HourglassTopIcon /> },
      rejected: { label: 'مرفوض', color: 'error', icon: <CancelIcon /> },
    };
    const config = statusConfig[status] || { label: status, color: 'default', icon: <ReceiptIcon /> };
    return <Chip icon={config.icon} label={config.label} color={config.color} variant="outlined" />;
};


const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await PaymentService.getMyPayments();
      setPayments(response.data.payments || []);
    } catch (err) {
      setError('فشل في تحميل سجل المدفوعات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredPayments = payments.filter(p => activeTab === 'all' || p.status === activeTab);

  return (
    <Box className="payments-page-container">
        <AbstractShape sx={{ width: 200, height: 200, top: '5%', right: '-80px' }} />
        <AbstractShape sx={{ width: 150, height: 150, bottom: '10%', left: '-70px', animationDuration: '25s' }} />

      <Box className="payments-header">
        <Typography variant="h4" component="h1" fontWeight={800}>سجل المدفوعات</Typography>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => setIsModalOpen(true)}>
          إضافة طلب دفع جديد
        </Button>
      </Box>

      <Paper className="payments-paper">
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tab label="الكل" value="all" />
          <Tab label="المقبولة" value="approved" />
          <Tab label="قيد المراجعة" value="pending" />
          <Tab label="المرفوضة" value="rejected" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <Grid container spacing={3} className="payments-grid">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <Grid item xs={12} md={6} lg={4} key={payment.payment_id}>
                    <div className="payment-card" style={{ animationDelay: `${index * 0.1}s`}}>
                        <div className="card-top">
                            <Typography className="course-title">{payment.course_title}</Typography>
                            <PaymentStatusChip status={payment.status} />
                        </div>
                        <div className="card-middle">
                            <Typography className="amount">{payment.amount} <span className="currency">ج.م</span></Typography>
                            <Typography className="method">{payment.method === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي'}</Typography>
                        </div>
                        <div className="card-bottom">
                            <Typography className="date">{new Date(payment.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</Typography>
                            {payment.screenshot_path && 
                                <a href={payment.screenshot_path} target="_blank" rel="noopener noreferrer" className="receipt-link">عرض الإيصال</a>
                            }
                        </div>
                    </div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ p: 5, textAlign: 'center' }}>
                  <ReceiptIcon sx={{ fontSize: 60, color: 'grey.300' }}/>
                  <Typography color="text.secondary" sx={{ mt: 2 }}>لا توجد مدفوعات لعرضها في هذا القسم.</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Paper>
      
      {/* Modal for new payment */}
      <PaymentFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onPaymentSuccess={fetchPayments} />
    </Box>
  );
};

export default PaymentsPage;