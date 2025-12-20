/**
 * ProtectedRoute Component
 * ป้องกันการเข้าถึง route ที่ต้อง authentication และ authorization
 * 
 * รองรับทั้ง:
 * 1. Authentication check (ต้อง login)
 * 2. Role-based authorization (ตรวจสอบจาก JWT roles)
 * 
 * หมายเหตุ:
 * - Roles มาจาก JWT token (decoded client-side)
 * - ไม่เชื่อ role ที่มาจาก API response เพราะ tamper ได้
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component ที่ต้องการ protect
 * @param {string[]} [props.allowedRoles] - Array ของ roles ที่อนุญาต (optional)
 */
export const ProtectedRoute = ({ children, allowedRoles = null }) => {
    const { isAuthenticated, loading, roles } = useAuth();
    const location = useLocation();

    // แสดง loading spinner ขณะกำลังตรวจสอบ auth status
    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    // ถ้ายังไม่ได้ login ให้ redirect ไป login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // ตรวจสอบ role-based authorization
    if (allowedRoles && allowedRoles.length > 0) {
        const hasPermission = roles.some(role => allowedRoles.includes(role));

        if (!hasPermission) {
            console.warn('[ProtectedRoute] Access denied:', {
                path: location.pathname,
                userRoles: roles,
                allowedRoles,
            });
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // ถ้าผ่านทุก check ให้แสดง children
    return children;
};
