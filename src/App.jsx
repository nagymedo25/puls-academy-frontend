// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/auth/RegisterPage'; 
import LoginPage from './pages/auth/LoginPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PaymentsManagementPage from './pages/admin/PaymentsManagementPage';
import CourseManagementPage from './pages/admin/CourseManagementPage';
import StudentManagementPage from './pages/admin/StudentManagementPage';
import AdminRoute from './components/common/AdminRoute';

// ✨ START: Student Dashboard Imports ✨
import DashboardLayout from './pages/student/Dashboard/DashboardLayout';
import MyCoursesPage from './pages/student/Dashboard/MyCoursesPage'; // الصفحة الرئيسية الجديدة
import NotificationsPage from './pages/student/Dashboard/NotificationsPage'; // صفحة الإشعارات
import ProfilePage from './pages/student/Dashboard/ProfilePage'; // صفحة الملف الشخصي
import PrivateRoute from './components/common/PrivateRoute';
// ✨ END: Student Dashboard Imports ✨


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

        {/* ✨ START: Updated Private Student Dashboard Routes ✨ */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<MyCoursesPage />} /> {/* الصفحة الرئيسية للداشبورد */}
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
        {/* ✨ END: Updated Private Student Dashboard Routes ✨ */}
        
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
