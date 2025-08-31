// src/components/admin/RevenueChart.jsx
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminService from '../../services/adminService';

const RevenueChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await AdminService.getRevenueReport();
                // عكس البيانات لعرض الأشهر الأقدم أولاً
                const formattedData = res.data.report.reverse().map(item => ({
                    name: item.month,
                    'الإيرادات (ج.م)': item.revenue
                }));
                setData(formattedData);
            } catch (err) {
                setError('فشل في تحميل بيانات الإيرادات.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    return (
        <Paper sx={{ p: 3, borderRadius: '16px', mt: 4, height: '400px', display: 'flex', flexDirection: 'column' }} elevation={4}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
                نظرة عامة على الإيرادات الشهرية
            </Typography>
            {loading ? <CircularProgress sx={{m: 'auto'}} /> : error ? <Alert severity="error">{error}</Alert> : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} ج.م`} />
                        <Legend />
                        <Bar dataKey="الإيرادات (ج.م)" fill="#F91C45" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Paper>
    );
};

export default RevenueChart;