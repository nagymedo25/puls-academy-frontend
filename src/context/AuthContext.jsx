import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

// --- شاشة التحميل الأولية ---
const AuthLoader = () => (
    <>
        <style>
            {`
                    .loader-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #f5f5f5;
                    }
                    .heart {
                        position: relative;
                        width: 100px;
                        height: 90px;
                        animation: heartbeat 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .heart::before,
                    .heart::after {
                        content: "";
                        position: absolute;
                        top: 0;
                        width: 52px;
                        height: 80px;
                        border-radius: 50px 50px 0 0;
                        background: #E50000;
                    }
                    .heart::before {
                        left: 50px;
                        transform: rotate(-45deg);
                        transform-origin: 0 100%;
                    }
                    .heart::after {
                        left: 0;
                        transform: rotate(45deg);
                        transform-origin: 100% 100%;
                    }
                    .heart-svg {
                        position: absolute;
                        width: 80%;
                        height: 80%;
                        z-index: 1;
                    }
                    .heart-beat {
                        stroke-dasharray: 200;
                        stroke-dashoffset: 200;
                        animation: draw-beat 1.2s infinite linear;
                        stroke: #FFFFFF;
                        stroke-width: 4;
                        fill: none;
                    }
                    @keyframes heartbeat {
                        0% { transform: scale(0.95); }
                        5% { transform: scale(1.1); }
                        39% { transform: scale(0.85); }
                        45% { transform: scale(1); }
                        60% { transform: scale(0.95); }
                        100% { transform: scale(0.9); }
                    }
                    @keyframes draw-beat {
                        0% { stroke-dashoffset: 200; }
                        50% { stroke-dashoffset: 0; }
                        100% { stroke-dashoffset: -200; }
                    }
                    `}
        </style>
        <div className="loader-container">
            <div className="heart">
                <svg className="heart-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path className="heart-beat" d="M10 50 Q 20 10, 40 50 T 90 50" />
                </svg>
            </div>
        </div>
    </>
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);
    const navigate = useNavigate();

    // دالة للتحقق من المستخدم عند تحميل التطبيق لأول مرة
    const verifyUser = useCallback(async () => {
        try {
            const response = await AuthService.getProfile();
            setUser(response.data.user);
        } catch (error) {
            setUser(null); // إذا فشل الطلب، فهذا يعني أن المستخدم غير مسجل الدخول
        } finally {
            setLoading(false); // إنهاء التحميل في كلتا الحالتين
        }
    }, []);

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

    const login = (userData) => {
        setUser(userData);
        setSessionExpired(false);
    };

    // ✨ --- تعديل دالة تسجيل الخروج --- ✨
    // نستخدم `useCallback` لضمان عدم إعادة تعريف الدالة إلا عند الحاجة
    const logout = useCallback(async (isSessionExpired = false) => {
        // لا تستدعي API الخروج إذا كان السبب هو انتهاء الجلسة بالفعل
        if (!isSessionExpired) {
            try {
                await AuthService.logout();
            } catch (error) {
                console.error("Logout API call failed, proceeding with client-side logout:", error);
            }
        }
        setUser(null);
        setSessionExpired(false);
        // استخدام `Maps` للتوجيه بدلاً من إعادة تحميل الصفحة بالكامل
        navigate('/login', { replace: true });
    }, [navigate]);

    // ✨ --- ربط حدث انتهاء الجلسة بالـ Context --- ✨
    useEffect(() => {
        const handleSessionExpired = () => {
            if (user) { // فقط إذا كان هناك مستخدم مسجل بالفعل
                setSessionExpired(true); // عرض المودال
            }
        };
        window.addEventListener('session-expired', handleSessionExpired);
        return () => window.removeEventListener('session-expired', handleSessionExpired);
    }, [user]); // يعتمد على `user` لمنع التشغيل غير الضروري

    const value = {
        user,
        loading,
        sessionExpired,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    if (loading) {
        return <AuthLoader />;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};