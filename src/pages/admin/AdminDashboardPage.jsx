// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import PendingPaymentsTable from '../../components/admin/PendingPaymentsTable';
import RevenueChart from '../../components/admin/RevenueChart';
import RevenueDetailModal from '../../components/admin/RevenueDetailModal'; // ✨ استيراد المودال

import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { keyframes } from '@emotion/react';

import './AdminDashboard.css';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false); // ✨ حالة جديدة
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsResponse, paymentsResponse] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getPendingPayments()
      ]);
      setStats(statsResponse.data);
      setPendingPayments(paymentsResponse.data.payments || []);
    } catch (err) {
      setError('فشل في جلب بيانات لوحة التحكم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetSuccess = () => {
      setIsRevenueModalOpen(false);
      fetchData(); // إعادة تحميل كل البيانات بعد التصفير
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress size={50} /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const mainStatCards = [
    { title: "إجمالي الطلاب", value: stats?.users?.total || 0, icon: <PeopleIcon />, color: "primary", link: "/admin/students", delay: 0.1 },
    { title: "إجمالي الكورسات", value: stats?.courses?.total_courses || 0, icon: <SchoolIcon />, color: "success", link: "/admin/courses", delay: 0.2 },
    // ✨ عند الضغط على هذا الكارت، سيتم فتح المودال
    { title: "إجمالي الإيرادات", value: `${stats?.payments?.total_revenue || 0} ج.م`, icon: <MonetizationOnIcon />, color: "warning", onClick: () => setIsRevenueModalOpen(true), delay: 0.3 },
  ];

  const pendingPaymentsCard = { 
    title: "مدفوعات قيد المراجعة", value: stats?.payments?.pending_count || 0, icon: <HourglassTopIcon />, 
    color: "info", link: "/admin/payments", delay: 0.4 
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, animation: `${fadeInUp} 0.5s ease-out` }}>
        لوحة التحكم الرئيسية
      </Typography>
      
      <div className="stats-grid-container">
        {mainStatCards.map((card) => (
          <div className="stat-card-item" key={card.title}>
            <StatCard {...card} navigate={navigate} />
          </div>
        ))}
      </div>
      
      <div className="full-width-card-item">
          <StatCard {...pendingPaymentsCard} navigate={navigate} />
      </div>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '24px', mt: 2 }}>
          <Box sx={{ width: { xs: '100%', lg: 'calc(66.66% - 12px)' } }}>
             <Box sx={{ animation: `${fadeInUp} 0.8s ease-out`}}>
                <PendingPaymentsTable payments={pendingPayments} />
             </Box>
          </Box>
          <Box sx={{ width: { xs: '100%', lg: 'calc(33.33% - 12px)' } }}>
            <Box sx={{ animation: `${fadeInUp} 0.9s ease-out`}}>
                <RevenueChart />
            </Box>
          </Box>
      </Box>

      {/* ✨ إضافة مودال تفاصيل الإيرادات */}
      <RevenueDetailModal
        open={isRevenueModalOpen}
        onClose={() => setIsRevenueModalOpen(false)}
        onResetSuccess={handleResetSuccess}
      />
    </Box>
  );
};

export default AdminDashboardPage;