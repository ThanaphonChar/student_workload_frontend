/**
 * Error Handler Utility
 * แปลง error messages จาก backend ให้เป็น user-friendly format
 */

/**
 * แปลง error object เป็น message string
 * @param {Error|Object} error - Error object จาก API หรือ network
 * @returns {string} User-friendly error message
 */
export const handleError = (error) => {
    // ถ้าเป็น Error object ที่มี message
    if (error.message) {
        return error.message;
    }

    // ถ้าเป็น object ที่มี error field
    if (error.error) {
        return error.error;
    }

    // Default error message
    return 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
};

/**
 * ตรวจสอบว่าเป็น network error หรือไม่
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
    return error.message === 'Failed to fetch' || error.message === 'Network request failed';
};
