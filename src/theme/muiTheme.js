/**
 * MUI Theme Configuration
 * 
 * ไฟล์นี้เป็น SINGLE SOURCE OF TRUTH สำหรับการกำหนด theme ของ Material UI
 * 
 * หลักการสำคัญ:
 * 1. Font Family ต้องตรงกับที่กำหนดใน tailwind.config.js
 * 2. ห้ามกำหนด font ซ้ำในแต่ละ component (ใช้ theme นี้เท่านั้น)
 * 3. Typography configuration ครอบคลุมทุก variant ของ MUI
 * 4. สามารถเพิ่ม custom color, spacing, breakpoints ได้ตรงนี้
 * 
 * การ maintain:
 * - หากต้องการเปลี่ยน font: แก้ FONT_FAMILY ตรงนี้ที่เดียว
 * - หากต้องการเพิ่ม variant: เพิ่มใน typography object
 * - หากต้องการเปลี่ยน theme color: แก้ palette object
 */

import { createTheme } from '@mui/material/styles';
import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * Font Stack Definition
 * 
 * ต้องตรงกับ tailwind.config.js เพื่อให้:
 * - MUI components ใช้ font เดียวกับ Tailwind
 * - HTML elements ทั่วไป ใช้ font เดียวกัน
 * - รองรับ fallback font เมื่อ KhwanThongCard โหลดไม่สำเร็จ
 */
const FONT_FAMILY = ['KhwanThongCard', ...defaultTheme.fontFamily.sans].join(',');

/**
 * Centralized Font Sizes
 * 
 * SINGLE SOURCE OF TRUTH สำหรับขนาดตัวอักษรทั้งโปรเจค
 * 
 * การใช้งาน:
 * import { FONT_SIZES } from '@/theme/muiTheme'
 * <Typography sx={{ fontSize: FONT_SIZES.medium }}>Text</Typography>
 * 
 * ข้อดี:
 * - แก้ที่เดียว ใช้ได้ทั่วโปรเจค
 * - Consistent font sizing
 * - ง่ายต่อการ maintain
 */
export const FONT_SIZES = {
    small: '1rem',      // 14px
    medium: '1.167rem',         // 16px
    large: '1.417rem',      // 18px
    extraLarge: '1.958rem',  // 20px
};

/**
 * MUI Theme Object
 * 
 * createTheme() สร้าง theme object ที่ MUI components ทั้งหมดจะใช้อ้างอิง
 * เมื่อ wrap app ด้วย <ThemeProvider theme={theme}> แล้ว
 * ทุก component จะได้ค่า default ตามนี้โดยอัตโนมัติ
 */
export const theme = createTheme({
    /**
     * Typography Configuration
     * 
     * กำหนด font family และ style สำหรับทุก typography variant ของ MUI
     * variants ที่ใช้บ่อย: h1-h6, body1, body2, button, caption
     */
    typography: {
        // Global font family สำหรับทุก typography variant
        fontFamily: FONT_FAMILY,

        // Button text styling
        button: {
            fontFamily: FONT_FAMILY,
            textTransform: 'none', // ปิดการแปลง uppercase อัตโนมัติ
            fontWeight: 500,
        },

        // Heading variants (h1-h6)
        h1: { fontFamily: FONT_FAMILY },
        h2: { fontFamily: FONT_FAMILY },
        h3: { fontFamily: FONT_FAMILY },
        h4: { fontFamily: FONT_FAMILY },
        h5: { fontFamily: FONT_FAMILY },
        h6: { fontFamily: FONT_FAMILY },

        // Body text variants
        body1: { fontFamily: FONT_FAMILY },
        body2: { fontFamily: FONT_FAMILY },

        // Other variants
        subtitle1: { fontFamily: FONT_FAMILY },
        subtitle2: { fontFamily: FONT_FAMILY },
        caption: { fontFamily: FONT_FAMILY },
        overline: { fontFamily: FONT_FAMILY },
    },

    /**
     * Color Palette (Optional)
     * 
     * กำหนด primary/secondary color ให้ตรงกับ brand identity
     * ตอนนี้ใช้ #050C9C เป็น primary color
     */
    palette: {
        primary: {
            main: '#050C9C',
            light: '#3A41C7',
            dark: '#040879',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#34C759', // iOS green (เหมือน IOSSwitch)
            contrastText: '#FFFFFF',
        },
    },

    /**
     * Component-specific Overrides (Optional)
     * 
     * กำหนด default props/styles สำหรับ component ต่างๆ
     * ใช้เมื่อต้องการ override MUI default behavior
     */
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: FONT_FAMILY,
                    borderRadius: 8, // มุมโค้ง consistent กับ design system
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        fontFamily: FONT_FAMILY,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    fontFamily: FONT_FAMILY,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontFamily: FONT_FAMILY,
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontFamily: FONT_FAMILY,
                },
            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    fontFamily: FONT_FAMILY,
                },
            },
        },
    },
});

export default theme;
