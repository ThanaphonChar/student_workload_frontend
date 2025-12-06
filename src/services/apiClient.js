/**
 * API Client
 * Generic HTTP client สำหรับติดต่อกับ backend API
 */

import { getAuth, clearAuth } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

/**
 * Generic API request function
 * @param {string} path - API endpoint path (e.g., '/auth/login')
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} Response data
 */
export const apiRequest = async (path, options = {}) => {
    try {
        // สร้าง full URL
        const url = `${API_BASE_URL}${path}`;

        // Default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // เพิ่ม Authorization header ถ้ามี token
        const auth = getAuth();
        if (auth?.token) {
            headers['Authorization'] = `Bearer ${auth.token}`;
        }

        // ทำ request
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Parse response
        const data = await response.json();

        // ตรวจสอบ HTTP status
        if (!response.ok) {
            // กรณี 401 Unauthorized - Token หมดอายุหรือไม่ถูกต้อง
            if (response.status === 401) {
                console.log('401 Unauthorized - clearing auth and redirecting to login');
                clearAuth();

                // Redirect ไป login page (ถ้าไม่ได้อยู่ที่ login page อยู่แล้ว)
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }

            // สร้าง error object พร้อม status และ message
            const error = new Error(data.message || `HTTP ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;

    } catch (error) {
        // Re-throw error เพื่อให้ caller จัดการต่อ
        throw error;
    }
};

/**
 * Convenience methods for common HTTP verbs
 */

export const get = (path, options = {}) => {
    return apiRequest(path, { ...options, method: 'GET' });
};

export const post = (path, body, options = {}) => {
    return apiRequest(path, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });
};

export const put = (path, body, options = {}) => {
    return apiRequest(path, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    });
};

export const del = (path, options = {}) => {
    return apiRequest(path, { ...options, method: 'DELETE' });
};
