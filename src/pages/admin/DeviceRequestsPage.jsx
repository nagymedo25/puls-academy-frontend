// src/pages/admin/DeviceRequestsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Alert, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminService from '../../services/adminService';

const DeviceRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState(null);

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

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                طلبات الدخول من أجهزة جديدة
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
        </Box>
    );
};

export default DeviceRequestsPage;