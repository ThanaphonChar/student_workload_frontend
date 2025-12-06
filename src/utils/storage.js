/**
 * Local Storage Utility
 * จัดการ authentication data ใน localStorage
 */

const AUTH_KEY = 'student_workload_auth';

/**
 * บันทึก auth data ลง localStorage
 * @param {Object} authData - { user, token, expiresAt }
 */
export const saveAuth = (authData) => {
    try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    } catch (error) {
        console.error('Failed to save auth data:', error);
    }
};

/**
 * อ่าน auth data จาก localStorage
 * @returns {Object|null} { user, token, expiresAt } หรือ null ถ้าหมดอายุหรือไม่มีข้อมูล
 */
export const getAuth = () => {
    try {
        const data = localStorage.getItem(AUTH_KEY);
        if (!data) return null;

        const authData = JSON.parse(data);

        // ตรวจสอบว่า token หมดอายุหรือยัง
        if (authData.expiresAt && Date.now() > authData.expiresAt) {
            console.log('Token expired, clearing auth data');
            clearAuth();
            return null;
        }

        return authData;
    } catch (error) {
        console.error('Failed to get auth data:', error);
        clearAuth();
        return null;
    }
};

/**
 * ลบ auth data ออกจาก localStorage
 */
export const clearAuth = () => {
    try {
        localStorage.removeItem(AUTH_KEY);
    } catch (error) {
        console.error('Failed to clear auth data:', error);
    }
};
