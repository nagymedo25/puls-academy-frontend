// src/pages/admin/ViolationsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Alert, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AdminService from '../../services/adminService';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ViolationsPage = () => {
    const [violators, setViolators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState(null);

    // Confirmation Modal State
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);

    const fetchViolators = useCallback(async () => {
        setLoading(true);
        try {
            const response = await AdminService.getViolators();
            setViolators(response.data.users || []);
        } catch (err) {
            setError('فشل في جلب قائمة المخالفين.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchViolators();
    }, [fetchViolators]);

    const handleActionClick = (action, userId, userName) => {
        let title = '';
        let message = '';
        if(action === 'suspend') {
            title = 'تأكيد تعليق الحساب';
            message = `هل أنت متأكد من تعليق حساب الطالب "${userName}"؟ لن يتمكن من تسجيل الدخول.`
        } else if (action === 'reactivate') {
            title = 'تأكيد إعادة التفعيل';
            message = `هل أنت متأكد من إعادة تفعيل حساب الطالب "${userName}"؟ سيتم تصفير عداد المخالفات.`
        } else if (action === 'delete') {
            title = 'تأكيد الحذف النهائي';
            message = `تحذير! هل أنت متأكد من حذف حساب الطالب "${userName}" بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.`
        }
        
        setActionToConfirm({ action, userId, title, message });
        setConfirmModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!actionToConfirm) return;

        const { action, userId } = actionToConfirm;
        setProcessingId(userId);
        setConfirmModalOpen(false);
        
        try {
            switch (action) {
                case 'suspend':
                    await AdminService.suspendUser(userId);
                    break;
                case 'reactivate':
                    await AdminService.reactivateUser(userId);
                    break;
                case 'delete':
                    await AdminService.deleteUser(userId);
                    break;
                default:
                    break;
            }
            fetchViolators(); // Refresh the list
        } catch (err) {
            setError(`فشل في تنفيذ الإجراء: ${err.response?.data?.error || err.message}`);
        } finally {
            setProcessingId(null);
            setActionToConfirm(null);
        }
    };


    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                إدارة الطلاب المخالفين
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                يتم عرض الطلاب الذين لديهم مخالفتين أو أكثر لمحاولة تسجيل الدخول المتزامن.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ borderRadius: '16px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>اسم الطالب</TableCell>
                            <TableCell>البريد/الهاتف</TableCell>
                            <TableCell align="center">عدد المخالفات</TableCell>
                            <TableCell align="center">الحالة</TableCell>
                            <TableCell align="center">الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {violators.length > 0 ? (
                            violators.map((user) => (
                                <TableRow key={user.user_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email || user.phone}</TableCell>
                                    <TableCell align="center">
                                        <Chip label={user.violation_count} color="error" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={user.status === 'active' ? 'نشط' : 'معلق'} color={user.status === 'active' ? 'success' : 'warning'} size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        {processingId === user.user_id ? <CircularProgress size={24} /> : (
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                {user.status === 'active' ? (
                                                    <Button size="small" color="warning" startIcon={<BlockIcon />} onClick={() => handleActionClick('suspend', user.user_id, user.name)}>تعليق</Button>
                                                ) : (
                                                    <Button size="small" color="success" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleActionClick('reactivate', user.user_id, user.name)}>تفعيل</Button>
                                                )}
                                                <Button size="small" color="error" startIcon={<DeleteForeverIcon />} onClick={() => handleActionClick('delete', user.user_id, user.name)}>حذف</Button>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    لا يوجد طلاب مخالفون حاليًا.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {actionToConfirm && (
                <ConfirmationModal
                    open={confirmModalOpen}
                    onClose={() => setConfirmModalOpen(false)}
                    onConfirm={handleConfirmAction}
                    title={actionToConfirm.title}
                    message={actionToConfirm.message}
                    loading={processingId === actionToConfirm.userId}
                />
            )}
        </Box>
    );
};

export default ViolationsPage;