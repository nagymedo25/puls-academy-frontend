import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from './context/AuthContext'; // ✨<-- هذا هو السطر الذي تم إصلاحه
import SessionExpiredModal from './components/common/SessionExpiredModal';

// --- Page Imports ---
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";

// --- Admin Imports ---
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import PaymentsManagementPage from "./pages/admin/PaymentsManagementPage";
import CourseManagementPage from "./pages/admin/CourseManagementPage";
import StudentManagementPage from "./pages/admin/StudentManagementPage";
import MessageManagementPage from "./pages/admin/MessageManagementPage";
import AdminRoute from "./components/common/AdminRoute";
import DeviceRequestsPage from "./pages/admin/DeviceRequestsPage";
import ViolationsPage from "./pages/admin/ViolationsPage";

// --- Student Dashboard Imports ---
import DashboardLayout from "./pages/student/Dashboard/DashboardLayout";
import MyCoursesPage from "./pages/student/Dashboard/MyCoursesPage";
import NotificationsPage from "./pages/student/Dashboard/NotificationsPage";
import ProfilePage from "./pages/student/Dashboard/ProfilePage";
import PrivateRoute from "./components/common/PrivateRoute";
import PaymentsPage from "./pages/student/Dashboard/PaymentsPage";
import CourseWatchPage from "./pages/student/CourseWatchPage";
import ChatPage from "./pages/student/Dashboard/ChatPage";

function App() {
  const { sessionExpired, logout, loading } = useAuth();

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [logout]);

  if (loading) {
    return null; 
  }

  return (
    <Router>
      <SessionExpiredModal open={sessionExpired} onConfirm={logout} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:courseId" element={<CourseDetailPage />} />

        {/* Private Routes for Students */}
        <Route element={<PrivateRoute />}>
          <Route path="/course/:courseId/watch" element={<CourseWatchPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<MyCoursesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
        </Route>

        {/* Private Admin Dashboard Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="payments" element={<PaymentsManagementPage />} />
            <Route path="courses" element={<CourseManagementPage />} />
            <Route path="students" element={<StudentManagementPage />} />
            <Route path="messages" element={<MessageManagementPage />} />
            <Route path="device-requests" element={<DeviceRequestsPage />} />
            <Route path="violations" element={<ViolationsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

