// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/auth/RegisterPage'; 
import LoginPage from './pages/auth/LoginPage';
import CoursesPage from './pages/CoursesPage'; // <-- إضافة استيراد الصفحة الجديدة
import DashboardLayout from './pages/student/Dashboard/DashboardLayout';
import DashboardHomePage from './pages/student/Dashboard/DashboardHomePage';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<CoursesPage />} /> {/* <-- إضافة المسار الجديد */}

        {/* Private Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHomePage />} />
            {/* يمكنك إضافة مسارات لوحة التحكم الأخرى هنا مستقبلًا */}
            {/* مثال: <Route path="/dashboard/notifications" element={<NotificationsPage />} /> */}
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;