import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import AdminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import PendingPaymentsTable from '../../components/admin/PendingPaymentsTable';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(''); // Reset error on new fetch
                const response = await AdminService.getDashboardStats();
                setStats(response.data);
            } catch (err) {
                // Use the error message from the backend if available
                setError(err.response?.data?.error || 'فشل في جلب بيانات لوحة التحكم. يرجى تحديث الصفحة.');
                console.error("Error fetching admin stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Render the error message within the dashboard page itself
    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                لوحة التحكم الرئيسية
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الطلاب"
                        value={stats?.totalStudents ?? 0}
                        icon={<PeopleAltIcon sx={{ fontSize: 40 }} />}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الكورسات"
                        value={stats?.totalCourses ?? 0}
                        icon={<SchoolIcon sx={{ fontSize: 40 }} />}
                        color="secondary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="إجمالي الأرباح"
                        value={`$${stats?.totalRevenue ?? 0}`}
                        icon={<MonetizationOnIcon sx={{ fontSize: 40 }} />}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="مدفوعات معلقة"
                        value={stats?.pendingPaymentsCount ?? 0}
                        icon={<HourglassEmptyIcon sx={{ fontSize: 40 }} />}
                        color="warning.main"
                    />
                </Grid>
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                        <RevenueChart />
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 2, height: '400px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            أحدث المدفوعات المعلقة
                        </Typography>
                        <PendingPaymentsTable />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboardPage;