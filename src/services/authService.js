/**
 * Authentication Service
 * จัดการ authentication logic กับ backend
 */

import { post } from './apiClient';

/**
 * Login ด้วย username และ password
 * @param {string} username - TU username
 * @param {string} password - Password
 * @returns {Promise<Object>} { user, token, expiresIn }
 * @throws {Error} ถ้า login ไม่สำเร็จ
 */
export const login = async (username, password) => {
    try {
        // เรียก backend login API
        const data = await post('/auth/login', {
            UserName: username,
            PassWord: password,
        });

        // ตรวจสอบ response
        if (data.success !== true) {
            throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
        }

        // Return ข้อมูลที่จำเป็น
        return {
            user: data.user,
            token: data.token,
            expiresIn: data.expiresIn || 2592000, // Default 30 days
        };

    } catch (error) {
        // แปลง error message ให้เป็นภาษาไทย
        if (error.message.includes('Invalid') || error.message.includes('Password')) {
            throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
        if (error.message.includes('Failed to fetch')) {
            throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        }
        throw error;
    }
};

/**
 * Logout (ตอนนี้แค่ clear local data, อาจจะเพิ่ม API call ในอนาคต)
 */
export const logout = async () => {
    // ในอนาคตอาจจะมี API endpoint สำหรับ logout
    // await post('/auth/logout');
    return Promise.resolve();
};
