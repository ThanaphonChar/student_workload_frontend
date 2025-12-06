/**
 * AppRouter Component
 * กำหนด routes ทั้งหมดของ application
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

export const AppRouter = () => {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                {/* Login Route - ถ้า login แล้วให้ redirect ไป dashboard */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route - redirect ไป dashboard หรือ login */}
                <Route
                    path="/"
                    element={
                        <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                    }
                />

                {/* 404 Route */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                                <p className="text-gray-600 mb-4">ไม่พบหน้าที่คุณต้องการ</p>
                                <a href="/" className="text-blue-600 hover:underline">
                                    กลับสู่หน้าหลัก
                                </a>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};
