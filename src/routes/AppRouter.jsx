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
import MySubjectsPage from '../pages/subjects/MySubjectsPage';
import TermListPage from '../pages/terms/TermListPage';
import TermCreatePage from '../pages/terms/TermCreatePage';
import { TermEditPage } from '../pages/terms/TermEditPage';
import { TermDetailPage } from '../pages/terms/TermDetailPage';
import CourseStatusByTermPage from '../pages/courseStatus/CourseStatusByTermPage';
import ActiveTermCourseStatusPage from '../pages/courseStatus/ActiveTermCourseStatusPage';
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
                        isAuthenticated ? <Navigate to="/profile" replace /> : <LoginPage />
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/profile"
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

                {/* Term Routes - Role-based Protection */}
                <Route
                    path="/terms"
                    element={
                        <ProtectedRoute>
                            <TermListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/terms/create"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.ACADEMIC_OFFICER]}>
                            <TermCreatePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/terms/:id"
                    element={
                        <ProtectedRoute>
                            <TermDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/terms/edit/:id"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.ACADEMIC_OFFICER]}>
                            <TermEditPage />
                        </ProtectedRoute>
                    }
                />

                {/* Course Status Routes - Role-based Protection */}
                <Route
                    path="/course-status"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER]}>
                            <ActiveTermCourseStatusPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/course-status/term/:termId"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER]}>
                            <CourseStatusByTermPage />
                        </ProtectedRoute>
                    }
                />

                {/* My Subjects Route - Professor Only */}
                <Route
                    path="/my-subjects"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.PROFESSOR]}>
                            <MySubjectsPage />
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
                        <Navigate to={isAuthenticated ? "/profile" : "/login"} replace />
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
