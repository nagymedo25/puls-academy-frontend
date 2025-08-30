// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/auth/RegisterPage'; 
import LoginPage from './pages/auth/LoginPage';
import CoursesPage from './pages/CoursesPage';

// استيراد مكونات الأدمن الجديدة
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PaymentsManagementPage from './pages/admin/PaymentsManagementPage';
import CourseManagementPage from './pages/admin/CourseManagementPage';
import StudentManagementPage from './pages/admin/StudentManagementPage';
import AdminRoute from './components/common/AdminRoute'; // استيراد مسار الأدمن المحمي

import DashboardLayout from './pages/student/Dashboard/DashboardLayout';
import DashboardHomePage from './pages/student/Dashboard/DashboardHomePage';
import PrivateRoute from './components/common/PrivateRoute';
import CourseDetailPage from './pages/CourseDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<CoursesPage />} />
         <Route path="/course/:courseId" element={<CourseDetailPage />} />

        {/* Private Student Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHomePage />} />
            {/* يمكنك إضافة مسارات لوحة التحكم الأخرى هنا مستقبلًا */}
          </Route>
        </Route>
        
        {/* Private Admin Dashboard Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="payments" element={<PaymentsManagementPage />} />
            <Route path="courses" element={<CourseManagementPage />} />
            <Route path="students" element={<StudentManagementPage />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;