// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';
import { Box } from '@mui/material';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AuthService.getProfile()
            .then(response => {
                setUser(response.data.user);
            })
            .catch(() => {
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
        await AuthService.logout();
        setUser(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    // ✨ --- START: التعديل الرئيسي هنا --- ✨
    // استبدال الدائرة الدوارة بتصميم القلب النابض
    if (loading) {
        return (
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
    }
    // ✨ --- END: نهاية التعديل --- ✨

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};