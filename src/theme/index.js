/**
 * Theme Module Exports
 * 
 * Central export point สำหรับ theme configuration ทั้งหมด
 * 
 * การใช้งาน:
 * import { theme, FONT_SIZES } from '@/theme'
 * 
 * ข้อดี:
 * - Import path สั้น และชัดเจน
 * - หาก้ามีการเพิ่ม theme variant อื่นๆ (dark mode, etc.) ก็ export จากที่เดียว
 * - Refactoring ง่าย (แก้ที่เดียว ใช้ทั่วโปรเจค)
 */

export { theme, default, FONT_SIZES } from './muiTheme';
