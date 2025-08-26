// src/components/common/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // 1. التحقق من وجود التوكن في التخزين المحلي للمتصفح
  const isAuthenticated = !!localStorage.getItem('token'); 

  // 2. إذا كان المستخدم مسجلاً دخوله (التوكن موجود)، اسمح له بالوصول للمحتوى
  //    مكون <Outlet /> هو الذي يعرض الصفحات الفرعية المحمية (مثل DashboardHomePage)
  // 3. إذا لم يكن مسجلاً، قم بإعادة توجيهه إلى صفحة تسجيل الدخول
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
