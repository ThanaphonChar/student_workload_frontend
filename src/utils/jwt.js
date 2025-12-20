/**
 * JWT Utilities
 * Helper functions สำหรับจัดการ JWT token
 * 
 * หมายเหตุ:
 * - Decode เฉพาะ payload ไม่ verify signature (verify ทำที่ backend)
 * - ใช้สำหรับดึงข้อมูลที่ไม่ sensitive เท่านั้น
 */

/**
 * Decode JWT token (without verification)
 * @param {string} token - JWT token string
 * @returns {Object|null} - Decoded payload หรือ null ถ้า decode ไม่ได้
 */
export function decodeJWT(token) {
    if (!token || typeof token !== 'string') {
        return null;
    }

    try {
        // JWT format: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('[JWT] Invalid token format');
            return null;
        }

        // Decode payload (base64url)
        const payload = parts[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

        return decoded;
    } catch (error) {
        console.error('[JWT] Failed to decode token:', error);
        return null;
    }
}

/**
 * ดึง user id จาก JWT
 * @param {string} token - JWT token string
 * @returns {string|null} - User ID หรือ null
 */
export function getUserIdFromToken(token) {
    const decoded = decodeJWT(token);
    return decoded?.sub || null;
}

/**
 * ดึง roles จาก JWT
 * @param {string} token - JWT token string
 * @returns {string[]} - Array of roles (empty array ถ้าไม่มี)
 */
export function getRolesFromToken(token) {
    const decoded = decodeJWT(token);
    const roles = decoded?.roles;

    if (Array.isArray(roles)) {
        return roles;
    }

    return [];
}

/**
 * ตรวจสอบว่า token หมดอายุหรือยัง
 * @param {string} token - JWT token string
 * @returns {boolean} - true ถ้าหมดอายุ
 */
export function isTokenExpired(token) {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
        return true;
    }

    // exp เป็น Unix timestamp (seconds)
    const expirationTime = decoded.exp * 1000;
    const now = Date.now();

    return now >= expirationTime;
}

/**
 * ตรวจสอบว่า user มี role ที่ระบุหรือไม่
 * @param {string} token - JWT token string
 * @param {string|string[]} requiredRoles - Role(s) ที่ต้องการ
 * @returns {boolean}
 */
export function hasRole(token, requiredRoles) {
    const userRoles = getRolesFromToken(token);

    if (!userRoles || userRoles.length === 0) {
        return false;
    }

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    return rolesArray.some(role => userRoles.includes(role));
}
