// src/components/admin/StudentDetailModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, CircularProgress, Alert, IconButton, Tabs, Tab, Paper, List, ListItem, ListItemText, Divider, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminService from '../../services/adminService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CancelIcon from '@mui/icons-material/Cancel';


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const StatusChip = ({ status }) => {
    const statusConfig = {
      approved: { label: 'مقبول', color: 'success', icon: <CheckCircleIcon /> },
      active: { label: 'مفعّل', color: 'success', icon: <CheckCircleIcon /> },
      pending: { label: 'قيد المراجعة', color: 'warning', icon: <HourglassTopIcon /> },
      rejected: { label: 'مرفوض', color: 'error', icon: <CancelIcon /> },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip icon={config.icon} label={config.label} color={config.color} size="small" />;
};


const StudentDetailModal = ({ open, onClose, student }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (open && student) {
      const fetchDetails = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await AdminService.getUserDetails(student.user_id);
          setDetails(response.data);
        } catch (err) {
          setError('فشل في جلب تفاصيل الطالب.');
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [open, student]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Modal open={open} onClose={onClose}>
        <div className="detail-modal-box">
            <div className="detail-modal-header">
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon /></IconButton>
                <Typography variant="h5" component="h2" fontWeight="700">{student?.name}</Typography>
                <Typography color="text.secondary">{student?.email}</Typography>
            </div>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#fff' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} centered>
                    <Tab label="الكورسات المسجلة" />
                    <Tab label="سجل المدفوعات" />
                </Tabs>
            </Box>

            <div className="detail-modal-content">
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        <TabPanel value={tabIndex} index={0}>
                            <Typography variant="h6" gutterBottom>الكورسات</Typography>
                            <List component={Paper}>
                                {details?.enrollments?.length > 0 ? details.enrollments.map(enroll => (
                                    <ListItem key={enroll.enrollment_id} divider>
                                        <ListItemText primary={enroll.course_title} secondary={`تاريخ التسجيل: ${new Date(enroll.enrolled_at).toLocaleDateString('ar-EG')}`} />
                                        <StatusChip status={enroll.status} />
                                    </ListItem>
                                )) : <Typography sx={{p:2, textAlign:'center'}}>لم يسجل في أي كورس بعد.</Typography>}
                            </List>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                             <Typography variant="h6" gutterBottom>المدفوعات</Typography>
                             <List component={Paper}>
                                {details?.payments?.length > 0 ? details.payments.map(payment => (
                                    <ListItem key={payment.payment_id} divider>
                                        <ListItemText primary={`${payment.course_title} - ${payment.amount} ج.م`} secondary={`تاريخ الدفع: ${new Date(payment.created_at).toLocaleDateString('ar-EG')}`} />
                                        <StatusChip status={payment.status} />
                                    </ListItem>
                                )) : <Typography sx={{p:2, textAlign:'center'}}>لا يوجد سجل مدفوعات.</Typography>}
                            </List>
                        </TabPanel>
                    </>
                )}
            </div>
        </div>
    </Modal>
  );
};

export default StudentDetailModal;