/**
 * Authentication Context
 * จัดการ state และ logic ของ authentication ทั้งหมด
 */

import { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { getAuth, saveAuth, clearAuth } from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // โหลด auth data จาก localStorage ตอน mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const authData = getAuth();
                if (authData) {
                    setUser(authData.user);
                    setToken(authData.token);
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
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

            // เรียก auth service
            const { user, token, expiresIn } = await authService.login(username, password);

            // คำนวณเวลาหมดอายุ
            const expiresAt = Date.now() + expiresIn * 1000;

            // บันทึกลง localStorage
            saveAuth({ user, token, expiresAt });

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

    // คำนวณ isAuthenticated
    const isAuthenticated = !!user && !!token;

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        loading,
        authError,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
