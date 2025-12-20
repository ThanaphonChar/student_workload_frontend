/**
 * Authentication Context
 * จัดการ state และ logic ของ authentication ทั้งหมด
 * 
 * หมายเหตุ:
 * - เก็บ token เป็น single source of truth
 * - Decode roles จาก JWT เมื่อต้องใช้งาน
 * - ไม่เก็บ user data ที่มาจาก backend response (ป้องกัน tampering)
 */

import { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { getAuth, saveAuth, clearAuth } from '../utils/storage';
import { getUserIdFromToken, getRolesFromToken, isTokenExpired } from '../utils/jwt';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // โหลด token และ user จาก localStorage ตอน mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const authData = getAuth();
                if (authData?.token) {
                    // ตรวจสอบว่า token หมดอายุหรือยัง
                    if (!isTokenExpired(authData.token)) {
                        setToken(authData.token);
                        setUser(authData.user || null);
                    } else {
                        console.log('[Auth] Token expired, clearing storage');
                        clearAuth();
                    }
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                clearAuth();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Login function
     * @param {string} username
     * @param {string} password
     * @returns {Promise<void>}
     */
    const login = async (username, password) => {
        try {
            setAuthError(null);
            setLoading(true);

            // เรียก auth service (จะได้ token และ user กลับมา)
            const { user, token } = await authService.login(username, password);

            // บันทึก token และ user ลง localStorage
            saveAuth({ user, token });

            // อัพเดท state
            setUser(user);
            setToken(token);

        } catch (error) {
            console.error('Login error:', error);
            setAuthError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout function
     */
    const logout = async () => {
        try {
            // เรียก logout service (ถ้ามี)
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state และ storage
            setUser(null);
            setToken(null);
            setAuthError(null);
            clearAuth();
        }
    };

    // Derived state จาก token
    const isAuthenticated = !!token && !isTokenExpired(token);
    const userId = token ? getUserIdFromToken(token) : null;
    const roles = token ? getRolesFromToken(token) : [];

    const value = {
        // User data (from API response)
        user,

        // Token
        token,

        // Derived from JWT
        userId,
        roles,
        isAuthenticated,

        // State
        loading,
        authError,

        // Actions
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
