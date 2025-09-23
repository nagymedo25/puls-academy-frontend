// src/pages/admin/DeviceRequestsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Alert, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Tooltip, useTheme, useMediaQuery, Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminService from '../../services/adminService';
import './ResponsiveAdmin.css'; // ✨ 1. استيراد ملف الأنماط الجديد

const DeviceRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const theme = useTheme(); // ✨ 2. استخدام الثيم للوصول إلى نقاط التوقف
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // ✨ 3. التحقق من حجم الشاشة

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await AdminService.getDeviceRequests();
            setRequests(response.data.requests || []);
        } catch (err) {
            setError('فشل في جلب طلبات الأجهزة.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = async (requestId, action) => {
        setProcessingId(requestId);
        try {
            if (action === 'approve') {
                await AdminService.approveDeviceRequest(requestId);
            } else {
                await AdminService.rejectDeviceRequest(requestId);
            }
            fetchRequests(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.error || `فشل في ${action === 'approve' ? 'الموافقة' : 'رفض'} الطلب.`);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    // ✨ 4. مكون البطاقة للشاشات الصغيرة
    const MobileCard = ({ req }) => (
        <Paper className="responsive-card" elevation={2}>
            <Box className="card-header">
                <Avatar sx={{ bgcolor: 'primary.light' }}>{req.user_name.charAt(0)}</Avatar>
                <Box>
                    <Typography fontWeight="600">{req.user_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{req.user_email}</Typography>
                </Box>
            </Box>
            <Box className="card-body">
                <div className="detail-item">
                    <span className="label">الجهاز</span>
                    <Tooltip title={req.user_agent}>
                        <Typography variant="body2" className="value" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {req.user_agent}
                        </Typography>
                    </Tooltip>
                </div>
                <div className="detail-item">
                    <span className="label">تاريخ الطلب</span>
                    <span className="value">{new Date(req.created_at).toLocaleString('ar-EG')}</span>
                </div>
            </Box>
            <Box className="card-footer">
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    disabled={processingId === req.request_id}
                    onClick={() => handleAction(req.request_id, 'approve')}
                >
                    {processingId === req.request_id ? <CircularProgress size={20} /> : 'موافقة'}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<CancelIcon />}
                    disabled={processingId === req.request_id}
                    onClick={() => handleAction(req.request_id, 'reject')}
                >
                    {processingId === req.request_id ? <CircularProgress size={20} /> : 'رفض'}
                </Button>
            </Box>
        </Paper>
    );

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                طلبات الدخول من أجهزة جديدة
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* ✨ 5. العرض المشروط بناءً على حجم الشاشة */}
            {isMobile ? (
                <Box>
                    {requests.length > 0 ? (
                        requests.map((req) => <MobileCard key={req.request_id} req={req} />)
                    ) : (
                        <Typography sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                            لا توجد طلبات معلقة حاليًا.
                        </Typography>
                    )}
                </Box>
            ) : (
                 <TableContainer component={Paper} sx={{ borderRadius: '16px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>اسم الطالب</TableCell>
                                <TableCell>البريد الإلكتروني</TableCell>
                                <TableCell>معلومات الجهاز</TableCell>
                                <TableCell>تاريخ الطلب</TableCell>
                                <TableCell align="center">الإجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.length > 0 ? (
                                requests.map((req) => (
                                    <TableRow key={req.request_id}>
                                        <TableCell>{req.user_name}</TableCell>
                                        <TableCell>{req.user_email}</TableCell>
                                        <TableCell>
                                            <Tooltip title={req.user_agent}>
                                                <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {req.user_agent}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{new Date(req.created_at).toLocaleString('ar-EG')}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    startIcon={<CheckCircleIcon />}
                                                    disabled={processingId === req.request_id}
                                                    onClick={() => handleAction(req.request_id, 'approve')}
                                                >
                                                    {processingId === req.request_id ? <CircularProgress size={20} /> : 'موافقة'}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<CancelIcon />}
                                                    disabled={processingId === req.request_id}
                                                    onClick={() => handleAction(req.request_id, 'reject')}
                                                >
                                                    {processingId === req.request_id ? <CircularProgress size={20} /> : 'رفض'}
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        لا توجد طلبات معلقة حاليًا.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default DeviceRequestsPage;