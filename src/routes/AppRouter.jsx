/**
 * AppRouter Component
 * กำหนด routes ทั้งหมดของ application
 * รองรับ role-based access control
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { HomePage } from '../pages/home/HomePage';
import { FontTestPage } from '../pages/test/FontTestPage';
import { SubjectListPage } from '../pages/subjects/SubjectListPage';
import { SubjectCreatePage } from '../pages/subjects/SubjectCreatePage';
import { SubjectEditPage } from '../pages/subjects/SubjectEditPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../config/roleConfig';

export const AppRouter = () => {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                {/* Login Route - ถ้า login แล้วให้ redirect ไป home */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />

                {/* Subject Routes - Role-based Protection */}
                <Route
                    path="/subjects"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER]}>
                            <SubjectListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/subjects/create"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER]}>
                            <SubjectCreatePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/subjects/edit/:id"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER]}>
                            <SubjectEditPage />
                        </ProtectedRoute>
                    }
                />

                {/* Unauthorized Page */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Font Test Route - Public route for testing */}
                <Route path="/font-test" element={<FontTestPage />} />

                {/* Default Route - redirect ไป home หรือ login */}
                <Route
                    path="/"
                    element={
                        <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
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
