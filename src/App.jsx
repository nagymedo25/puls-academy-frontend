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
import MessageManagementPage from './pages/admin/MessageManagementPage'; // استيراد صفحة الرسائل الجديدة
import AdminRoute from './components/common/AdminRoute';

// Student Dashboard Imports
import DashboardLayout from './pages/student/Dashboard/DashboardLayout';
import MyCoursesPage from './pages/student/Dashboard/MyCoursesPage';
import NotificationsPage from './pages/student/Dashboard/NotificationsPage';
import ProfilePage from './pages/student/Dashboard/ProfilePage';
import PrivateRoute from './components/common/PrivateRoute';
import PaymentsPage from "./pages/student/Dashboard/PaymentsPage";
import CourseWatchPage from "./pages/student/CourseWatchPage";
import ChatPage from "./pages/student/Dashboard/ChatPage"; // استيراد صفحة الدردشة الجديدة

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

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          
          <Route path="/course/:courseId/watch" element={<CourseWatchPage />} />

          {/* Student Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<MyCoursesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="chat" element={<ChatPage />} /> {/* إضافة مسار الدردشة للطالب */}
          </Route>

        </Route>
        
        {/* Private Admin Dashboard Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="payments" element={<PaymentsManagementPage />} />
            <Route path="courses" element={<CourseManagementPage />} />
            <Route path="students" element={<StudentManagementPage />} />
            <Route path="messages" element={<MessageManagementPage />} /> {/* إضافة مسار الرسائل للأدمن */}
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
