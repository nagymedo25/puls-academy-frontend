// src/components/admin/RevenueDetailModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, Button, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import AdminService from '../../services/adminService';
import ConfirmationModal from '../common/ConfirmationModal';

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: { xs: '95%', md: '800px' }, maxHeight: '90vh', bgcolor: 'background.paper',
    borderRadius: '16px', boxShadow: 24, display: 'flex', flexDirection: 'column',
};

const RevenueDetailModal = ({ open, onClose, onResetSuccess }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await AdminService.getApprovedPayments();
            setPayments(res.data.payments || []);
        } catch (err) {
            setError('فشل في جلب بيانات المدفوعات.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchPayments();
        }
    }, [open]);

    const handleReset = async () => {
        setConfirmOpen(false);
        setLoading(true);
        try {
            await AdminService.resetRevenue();
            onResetSuccess(); // لإعادة تحميل الإحصائيات في الصفحة الرئيسية
        } catch (err) {
            setError('فشل في إعادة تصفير الإيرادات.');
        } finally {
            setLoading(false);
        }
    };
    
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                        <Box>
                           <Typography variant="h5" fontWeight="700">سجل الإيرادات</Typography>
                           <Typography color="text.secondary">إجمالي الإيرادات المعتمدة: {totalRevenue} ج.م</Typography>
                        </Box>
                        <IconButton onClick={onClose}><CloseIcon /></IconButton>
                    </Box>
                    <Box sx={{ overflowY: 'auto', p: 3 }}>
                        {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
                            <TableContainer component={Paper}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>الطالب</TableCell>
                                            <TableCell>الكورس</TableCell>
                                            <TableCell>المبلغ</TableCell>
                                            <TableCell>التاريخ</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {payments.map(p => (
                                            <TableRow key={p.payment_id}>
                                                <TableCell>{p.user_name}</TableCell>
                                                <TableCell>{p.course_title}</TableCell>
                                                <TableCell>{p.amount} ج.م</TableCell>
                                                <TableCell>{new Date(p.created_at).toLocaleDateString('ar-EG')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                    <Box sx={{ p: 2, borderTop: '1px solid #eee', textAlign: 'left' }}>
                        <Button variant="contained" color="error" startIcon={<ReplayIcon />} onClick={() => setConfirmOpen(true)}>
                            إعادة تصفير الإيرادات
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <ConfirmationModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleReset}
                title="تأكيد إعادة التصفير"
                message="تحذير: هذا الإجراء سيقوم بحذف جميع سجلات المدفوعات والتسجيلات بشكل نهائي. هل أنت متأكد؟"
                confirmText="نعم، قم بالحذف"
            />
        </>
    );
};

export default RevenueDetailModal;