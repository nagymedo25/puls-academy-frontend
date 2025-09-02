import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';
import { CircularProgress, Box } from '@mui/material';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // عند تحميل التطبيق، نحاول جلب بيانات المستخدم
        // إذا نجح الطلب (بسبب وجود httpOnly cookie صالح)، يتم تسجيل دخول المستخدم
        AuthService.getProfile()
            .then(response => {
                setUser(response.data.user);
            })
            .catch(() => {
                // إذا فشل، فهذا يعني أن المستخدم غير مسجل دخوله
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await AuthService.logout(); // استدعاء API لحذف الـ cookie من الخادم
        setUser(null);
        window.location.href = '/login'; // توجيه كامل لضمان تنظيف الحالة
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };
    
    // عرض شاشة تحميل بينما يتم التحقق من حالة المصادقة
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
