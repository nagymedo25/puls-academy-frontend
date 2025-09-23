// src/pages/admin/ViolationsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, CircularProgress, Alert, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, useTheme, useMediaQuery, Avatar
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AdminService from '../../services/adminService';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import './ResponsiveAdmin.css'; // ✨ 1. استيراد ملف الأنماط الجديد

const ViolationsPage = () => {
    const [violators, setViolators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const theme = useTheme(); // ✨ 2. استخدام الثيم
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // ✨ 3. التحقق من حجم الشاشة

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
        let confirmText = 'تأكيد';
        let color = 'primary';

        if (action === 'suspend') {
            title = 'تأكيد تعليق الحساب';
            message = `هل أنت متأكد من تعليق حساب الطالب "${userName}"؟ لن يتمكن من تسجيل الدخول.`;
            confirmText = 'نعم، قم بالتعليق';
            color = 'warning';
        } else if (action === 'reactivate') {
            title = 'تأكيد إعادة التفعيل';
            message = `هل أنت متأكد من إعادة تفعيل حساب الطالب "${userName}"؟ سيتم تصفير عداد المخالفات.`;
            confirmText = 'نعم، قم بالتفعيل';
            color = 'success';
        } else if (action === 'delete') {
            title = 'تأكيد الحذف النهائي';
            message = `تحذير! هل أنت متأكد من حذف حساب الطالب "${userName}" بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.`;
            confirmText = 'نعم، قم بالحذف';
            color = 'error';
        }

        setActionToConfirm({ action, userId, title, message, confirmText, color });
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
            fetchViolators();
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

    // ✨ 4. مكون البطاقة للشاشات الصغيرة
    const MobileCard = ({ user }) => (
        <Paper className="responsive-card" elevation={2}>
            <Box className="card-header">
                <Avatar sx={{ bgcolor: 'error.main', color: 'white' }}>{user.violation_count}</Avatar>
                 <Box>
                    <Typography fontWeight="600">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email || user.phone}</Typography>
                </Box>
            </Box>
            <Box className="card-body">
                 <div className="detail-item">
                    <span className="label">الحالة</span>
                    <span className="value">
                        <Chip label={user.status === 'active' ? 'نشط' : 'معلق'} color={user.status === 'active' ? 'success' : 'warning'} size="small" />
                    </span>
                </div>
            </Box>
             <Box className="card-footer">
                {processingId === user.user_id ? <CircularProgress size={24} /> : (
                    <>
                        {user.status === 'active' ? (
                            <Button size="small" color="warning" startIcon={<BlockIcon />} onClick={() => handleActionClick('suspend', user.user_id, user.name)}>تعليق</Button>
                        ) : (
                            <Button size="small" color="success" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleActionClick('reactivate', user.user_id, user.name)}>تفعيل</Button>
                        )}
                        <Button size="small" color="error" startIcon={<DeleteForeverIcon />} onClick={() => handleActionClick('delete', user.user_id, user.name)}>حذف</Button>
                    </>
                )}
            </Box>
        </Paper>
    );

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                إدارة الطلاب المخالفين
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                يتم عرض الطلاب الذين لديهم مخالفتين أو أكثر لمحاولة تسجيل الدخول المتزامن.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* ✨ 5. العرض المشروط */}
            {isMobile ? (
                 <Box>
                    {violators.length > 0 ? (
                        violators.map((user) => <MobileCard key={user.user_id} user={user} />)
                    ) : (
                         <Typography sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                            لا يوجد طلاب مخالفون حاليًا.
                        </Typography>
                    )}
                </Box>
            ) : (
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
            )}

            {actionToConfirm && (
                <ConfirmationModal
                    open={confirmModalOpen}
                    onClose={() => setConfirmModalOpen(false)}
                    onConfirm={handleConfirmAction}
                    title={actionToConfirm.title}
                    message={actionToConfirm.message}
                    confirmText={actionToConfirm.confirmText}
                    confirmButtonColor={actionToConfirm.color}
                    loading={processingId === actionToConfirm.userId}
                />
            )}
        </Box>
    );
};

export default ViolationsPage;