/**
 * ProtectedRoute Component
 * ป้องกันการเข้าถึง route ที่ต้อง authentication
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // แสดง loading spinner ขณะกำลังตรวจสอบ auth status
    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    // ถ้ายังไม่ได้ login ให้ redirect ไป login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // ถ้า authenticated แล้วให้แสดง children
    return children;
};
