// src/pages/admin/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../../services/adminService';

// Import Child Components (These will need to be refactored separately)
import StatCard from '../../components/admin/StatCard';
import PendingPaymentsTable from '../../components/admin/PendingPaymentsTable';
import RevenueChart from '../../components/admin/RevenueChart';
import RevenueDetailModal from '../../components/admin/RevenueDetailModal';

// Import Icons
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

// Import CSS
import './AdminDashboard.css';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
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
        fetchData(); // Reload all data after reset
    };

    if (loading) {
        return <div className="loading-container">{/* Add a custom CSS spinner here if you want */}Loading...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    const mainStatCards = [
        { title: "إجمالي الطلاب", value: stats?.users?.total || 0, icon: <PeopleIcon />, color: "primary", link: "/admin/students", area: "card1" },
        { title: "إجمالي الكورسات", value: stats?.courses?.total_courses || 0, icon: <SchoolIcon />, color: "success", link: "/admin/courses", area: "card2" },
        { title: "إجمالي الإيرادات", value: `${stats?.payments?.total_revenue || 0} ج.م`, icon: <MonetizationOnIcon />, color: "warning", onClick: () => setIsRevenueModalOpen(true), area: "card3" },
    ];

    const pendingPaymentsCard = { 
        title: "مدفوعات قيد المراجعة", value: stats?.payments?.pending_count || 0, icon: <HourglassTopIcon />, 
        color: "info", link: "/admin/payments", area: "payments"
    };
    return (
        <div className="admin-dashboard-page">
            <h1 className="page-title">لوحة التحكم الرئيسية</h1>
            
            <div className="dashboard-grid">
                {/* ✨ 2. رسم الكروت الثلاثة العلوية */}
                {mainStatCards.map((card) => (
                    <div className={`grid-item ${card.area}`} key={card.title}>
                        <StatCard {...card} navigate={navigate} />
                    </div>
                ))}
                
                {/* ✨ 3. رسم كارت المدفوعات بشكل مستقل ليأخذ الصف الكامل */}
                <div className={`grid-item ${pendingPaymentsCard.area}`}>
                    <StatCard {...pendingPaymentsCard} navigate={navigate} />
                </div>
                
                <div className="grid-item grid-item-table">
                    <PendingPaymentsTable payments={pendingPayments} />
                </div>

                <div className="grid-item grid-item-chart">
                    <RevenueChart />
                </div>
            </div>

            {/* Revenue Details Modal */}
            {isRevenueModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsRevenueModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setIsRevenueModalOpen(false)}>&times;</button>
                        <RevenueDetailModal
                            open={isRevenueModalOpen}
                            onClose={() => setIsRevenueModalOpen(false)}
                            onResetSuccess={handleResetSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;