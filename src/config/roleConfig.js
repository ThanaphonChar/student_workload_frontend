/**
 * Role Configuration
 * กำหนด roles และ permissions ในระบบ
 * 
 * เป็น single source of truth สำหรับ role-based access control
 */

// Role constants - ป้องกัน typo
export const ROLES = {
    ACADEMIC_OFFICER: 'Academic Officer',
    PROGRAM_CHAIR: 'Program Chair',
    PROFESSOR: 'Professor',
    STUDENT: 'Student',
};

// Route permissions - กำหนดว่า route ไหนต้องการ role อะไร
export const ROUTE_PERMISSIONS = {
    // Public routes (ไม่ต้อง login)
    '/login': null,
    '/unauthorized': null,

    // Protected routes with specific roles
    '/': [ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER, ROLES.STUDENT],
    '/subjects': [ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
    '/subjects/create': [ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
    '/subjects/:id': [ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
    '/subjects/:id/edit': [ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
};

// Menu configuration - กำหนดว่า menu item ไหนแสดงให้ role ไหนบ้าง
export const MENU_CONFIG = [
    {
        id: 'home',
        label: 'หน้าหลัก',
        path: '/',
        allowedRoles: [ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER, ROLES.STUDENT],
    },
    {
        id: 'subjects',
        label: 'ข้อมูลรายวิชา',
        path: '/subjects',
        allowedRoles: [ROLES.ACADEMIC_OFFICER],
        children: [
            {
                id: 'subjects-list',
                label: 'รายการวิชา',
                path: '/subjects',
                allowedRoles: [ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
            },
            {
                id: 'subjects-create',
                label: 'สร้างวิชาใหม่',
                path: '/subjects/create',
                allowedRoles: [ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
            },
        ],
    },
    {
        id: 'terms',
        label: 'ปีการศึกษา',
        path: '/terms',
        allowedRoles: [ROLES.ACADEMIC_OFFICER],
    },
    {
        id: 'course_status',
        label: 'สถานะรายวิชา',
        path: '/course-status',
        allowedRoles: [ROLES.PROFESSOR, ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
    },
    {
        id: 'my_subjects',
        label: 'รายวิชาของฉัน',
        path: '/my-subjects',
        allowedRoles: [ROLES.ACADEMIC_OFFICER, ROLES.PROFESSOR],
    },
    {
        id: 'dashboard',
        label: 'แดชบอร์ด',
        path: '/dashboard',
        allowedRoles: [ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
    },
    {
        id: 'role_management',
        label: 'การจัดการสิทธิ์',
        path: '/permissions',
        allowedRoles: [ROLES.PROGRAM_CHAIR, ROLES.ACADEMIC_OFFICER],
    },
];

/**
 * ตรวจสอบว่า user มีสิทธิ์เข้าถึง route หรือไม่
 * @param {string} path - Route path
 * @param {string|string[]} userRole - Role ของ user (string หรือ array)
 * @returns {boolean}
 */
export function canAccessRoute(path, userRole) {
    // ถ้าไม่มี user role แสดงว่ายังไม่ login
    if (!userRole) return false;

    // แปลง userRole เป็น array เสมอ
    const userRoles = Array.isArray(userRole) ? userRole : [userRole];

    // หา permission configuration ของ route
    // ใช้ exact match ก่อน ถ้าไม่เจอให้ match แบบ dynamic route
    let allowedRoles = ROUTE_PERMISSIONS[path];

    // ถ้าไม่เจอ exact match ลอง match แบบ dynamic (เช่น /subjects/:id)
    if (!allowedRoles) {
        const matchedKey = Object.keys(ROUTE_PERMISSIONS).find(key => {
            if (!key.includes(':')) return false;
            const pattern = key.replace(/:[^/]+/g, '[^/]+');
            const regex = new RegExp(`^${pattern}$`);
            return regex.test(path);
        });
        allowedRoles = matchedKey ? ROUTE_PERMISSIONS[matchedKey] : undefined;
    }

    // ถ้าไม่มี config แสดงว่า route นี้ไม่ต้อง protect (public)
    if (!allowedRoles) return true;

    // null แสดงว่าเป็น public route
    if (allowedRoles === null) return true;

    // ตรวจสอบว่า user มี role ที่อนุญาตหรือไม่
    return userRoles.some(role => allowedRoles.includes(role));
}

/**
 * กรอง menu items ตาม role ของ user
 * @param {string|string[]} userRole - Role ของ user
 * @returns {Array} Menu items ที่ user มีสิทธิ์เห็น
 */
export function getFilteredMenu(userRole) {
    if (!userRole) return [];

    const userRoles = Array.isArray(userRole) ? userRole : [userRole];

    return MENU_CONFIG.filter(item => {
        // ตรวจสอบว่า user มีสิทธิ์เห็น menu item หลักหรือไม่
        const hasAccess = item.allowedRoles.some(role => userRoles.includes(role));

        if (!hasAccess) return false;

        // ถ้ามี children ให้กรองด้วย
        if (item.children) {
            item.children = item.children.filter(child =>
                child.allowedRoles.some(role => userRoles.includes(role))
            );
        }

        return true;
    });
}

/**
 * ตรวจสอบว่า user มีสิทธิ์ใช้ action นี้หรือไม่
 * @param {string[]} requiredRoles - Roles ที่ต้องการ
 * @param {string|string[]} userRole - Role ของ user
 * @returns {boolean}
 */
export function hasRequiredRole(requiredRoles, userRole) {
    if (!userRole) return false;
    const userRoles = Array.isArray(userRole) ? userRole : [userRole];
    return userRoles.some(role => requiredRoles.includes(role));
}
