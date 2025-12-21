# Font Architecture Documentation

## 🎯 เป้าหมาย

ระบบจัดการ font ที่ทำให้ **"ขวานทอง" (KhwanThongCard)** เป็น **Single Source of Truth** สำหรับทั้ง:
- Material UI (MUI) components
- Tailwind CSS utilities
- HTML elements ทั่วไป

---

## 📁 โครงสร้างไฟล์

```
src/
├── theme/
│   ├── muiTheme.js          # MUI theme configuration (typography, colors, etc.)
│   └── index.js             # Central export point
│
├── index.css                # @font-face declarations + Tailwind imports
├── main.jsx                 # ThemeProvider wrapper
└── tailwind.config.js       # Tailwind font configuration (root level)
```

---

## 🔧 การทำงานของระบบ

### 1️⃣ Font Loading (`index.css`)

```css
@font-face {
    font-family: 'KhwanThongCard';
    src: url('/src/assets/fonts/KhwanThong-Card-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

**หน้าที่:**
- โหลดไฟล์ font จาก local assets
- กำหนด font-family name เป็น `KhwanThongCard`
- Support font variants: Regular (400), Bold (700), Italic, Light (300)

**ทำไมต้องทำ:**
- Browser ต้องโหลด font ก่อนที่จะ render text
- `font-display: swap` = แสดง fallback font ก่อน แล้วค่อย swap เมื่อ custom font โหลดเสร็จ

---

### 2️⃣ Tailwind Configuration (`tailwind.config.js`)

```javascript
export default {
  theme: {
    fontFamily: {
      sans: ['KhwanThongCard', ...defaultTheme.fontFamily.sans],
    },
  },
};
```

**หน้าที่:**
- กำหนด `font-sans` ให้ใช้ `KhwanThongCard` เป็นลำดับแรก
- Fallback เป็น system fonts (`ui-sans-serif`, `system-ui`, etc.)

**ผลลัพธ์:**
```jsx
// HTML elements และ Tailwind utilities จะใช้ KhwanThongCard โดยอัตโนมัติ
<div className="font-sans">ข้อความนี้ใช้ขวานทอง</div>
<p>ข้อความนี้ก็ใช้ขวานทอง (เพราะ default เป็น sans)</p>
```

---

### 3️⃣ MUI Theme Configuration (`theme/muiTheme.js`)

```javascript
const FONT_FAMILY = ['KhwanThongCard', ...defaultTheme.fontFamily.sans].join(',');

export const theme = createTheme({
  typography: {
    fontFamily: FONT_FAMILY,
    h1: { fontFamily: FONT_FAMILY },
    h2: { fontFamily: FONT_FAMILY },
    body1: { fontFamily: FONT_FAMILY },
    button: { fontFamily: FONT_FAMILY },
    // ... ทุก variant
  },
});
```

**หน้าที่:**
- สร้าง MUI theme object ที่กำหนด font เป็น `KhwanThongCard`
- ครอบคลุมทุก typography variant ของ MUI
- กำหนด primary color (#050C9C), component overrides

**ทำไมต้องทำ:**
- **MUI ไม่ได้อ่าน Tailwind config โดยอัตโนมัติ**
- MUI มี typography system ของตัวเอง (h1-h6, body1, body2, button, etc.)
- ถ้าไม่กำหนด theme, MUI จะใช้ default font (Roboto)

---

### 4️⃣ ThemeProvider Integration (`main.jsx`)

```jsx
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
```

**หน้าที่:**
- Wrap ทั้ง App ด้วย `ThemeProvider` เพื่อให้ทุก MUI component อ่าน theme ได้
- `CssBaseline` = Reset CSS และใช้ baseline styles ของ MUI

**ผลลัพธ์:**
```jsx
// ทุก MUI component จะใช้ KhwanThongCard โดยอัตโนมัติ
<Typography>ข้อความนี้ใช้ขวานทอง</Typography>
<Button>ปุ่มนี้ใช้ขวานทอง</Button>
<TextField label="Input นี้ใช้ขวานทอง" />
```

---

## ❓ ทำไม MUI ต้องมี Theme แยก? ทำไมไม่ใช้ Tailwind?

### ปัญหา: MUI และ Tailwind เป็นคนละระบบ

| Aspect | Tailwind CSS | Material UI |
|--------|-------------|-------------|
| **Styling System** | Utility classes (`font-sans`, `text-lg`) | JS-in-CSS (`sx` prop, `styled()`) |
| **Font Application** | Applies to HTML elements | Applies to MUI components |
| **Configuration** | `tailwind.config.js` | `createTheme()` |
| **Scope** | Global CSS classes | React component props |

**ตัวอย่างปัญหา:**

```jsx
// ❌ Tailwind class ไม่มีผลกับ MUI component
<Typography className="font-khwanthong">
  ข้อความนี้ไม่ได้ใช้ขวานทอง (ใช้ Roboto ของ MUI default)
</Typography>

// ✅ ต้องใช้ theme แทน
<ThemeProvider theme={theme}>
  <Typography>ข้อความนี้ใช้ขวานทอง (จาก theme)</Typography>
</ThemeProvider>
```

---

## ✅ หลักการสำคัญ (Design Principles)

### 1. Single Source of Truth

**Font Family Stack อยู่ที่เดียว:**
```javascript
// tailwind.config.js และ theme/muiTheme.js ใช้ค่าเดียวกัน
const FONT_STACK = ['KhwanThongCard', ...defaultTheme.fontFamily.sans];
```

**ข้อดี:**
- แก้ที่เดียว ใช้ได้ทั้งโปรเจค
- ไม่มี hardcoded font name กระจายตามไฟล์
- Refactoring ง่าย (เปลี่ยน font ใหม่ แก้ 2 ไฟล์ เท่านั้น)

---

### 2. Separation of Concerns

**Font configuration ≠ Component logic**

```jsx
// ❌ BAD: กำหนด font ใน component
<Button sx={{ fontFamily: 'KhwanThongCard' }}>Click Me</Button>

// ✅ GOOD: Component ไม่ต้องรู้เรื่อง font
<Button>Click Me</Button>
```

**เหตุผล:**
- Component ควร focus เฉพาะ business logic
- Styling concerns ควรอยู่ใน theme/config
- ถ้าต้องการเปลี่ยน font ไม่ต้อง refactor component

---

### 3. Centralized Configuration

**Theme อยู่ใน `/theme` folder แยกชัดเจน**

```
theme/
├── muiTheme.js     # Configuration only (no UI logic)
└── index.js        # Export point
```

**ข้อดี:**
- Developer รู้ทันทีว่า theme อยู่ที่ไหน
- ไม่มี theme logic กระจายตาม component
- Onboarding ง่าย (อ่าน 1 ไฟล์ เข้าใจทั้งระบบ)

---

### 4. Scalability

**สามารถเพิ่ม theme variant ได้ง่าย**

```javascript
// theme/muiTheme.js
export const theme = createTheme({ /* ... */ });

// theme/darkTheme.js (future)
export const darkTheme = createTheme({
  palette: { mode: 'dark' },
  typography: { fontFamily: FONT_FAMILY }, // ใช้ font เดิม
});
```

**ข้อดี:**
- เพิ่ม dark mode โดยไม่ต้องแก้ component
- Theme switching logic อยู่ที่เดียว
- Consistent font ทุก theme variant

---

## 🚫 สิ่งที่ห้ามทำ (Anti-Patterns)

### ❌ 1. กำหนด font ใน component แต่ละตัว

```jsx
// ❌ BAD: ซ้ำซ้อน maintainability ต่ำ
<Typography sx={{ fontFamily: 'KhwanThongCard' }}>Text 1</Typography>
<Button sx={{ fontFamily: 'KhwanThongCard' }}>Button</Button>
<TextField sx={{ '& input': { fontFamily: 'KhwanThongCard' } }} />
```

**ปัญหา:**
- แก้ font ต้องแก้ทุกไฟล์
- เสี่ยง typo (เขียน font name ผิด)
- Inconsistent (แต่ละคนเขียนต่างกัน)

---

### ❌ 2. ใช้ Tailwind class กับ MUI component

```jsx
// ❌ BAD: Tailwind class ไม่มีผลกับ MUI
<Typography className="font-khwanthong">
  Font ไม่เปลี่ยน (MUI ไม่อ่าน Tailwind)
</Typography>
```

**ปัญหา:**
- MUI render ด้วย emotion/styled-components (ไม่ใช่ Tailwind)
- Class name conflict (Tailwind reset อาจชนกับ MUI)

---

### ❌ 3. Import theme หลายที่

```jsx
// ❌ BAD: แต่ละหน้า import theme เอง
import { theme } from '../theme/muiTheme';

function Page() {
  return (
    <ThemeProvider theme={theme}>
      <Component />
    </ThemeProvider>
  );
}
```

**ปัญหา:**
- Nested ThemeProvider = performance overhead
- Context re-render ทุกครั้งที่ state เปลี่ยน
- Theme ควร wrap ที่ root เดียว (main.jsx)

---

## 🔧 การ Maintain และ Extend

### เปลี่ยน Font ทั้งโปรเจค

**Step 1:** แก้ `@font-face` ใน `index.css`
```css
@font-face {
    font-family: 'NewFont';
    src: url('/src/assets/fonts/NewFont.ttf') format('truetype');
}
```

**Step 2:** แก้ `tailwind.config.js`
```javascript
fontFamily: {
  sans: ['NewFont', ...defaultTheme.fontFamily.sans],
}
```

**Step 3:** แก้ `theme/muiTheme.js`
```javascript
const FONT_FAMILY = ['NewFont', ...defaultTheme.fontFamily.sans].join(',');
```

**ผลลัพธ์:** ทั้งโปรเจคเปลี่ยน font ทันทีโดยไม่ต้องแก้ component

---

### เพิ่ม Font Variant

```css
/* Light Italic (300 italic) */
@font-face {
    font-family: 'KhwanThongCard';
    src: url('/src/assets/fonts/KhwanThong-Card-LightItalic.ttf') format('truetype');
    font-weight: 300;
    font-style: italic;
}
```

**การใช้งาน:**
```jsx
<Typography fontWeight={300} fontStyle="italic">
  Light Italic Text
</Typography>
```

---

### เพิ่ม Dark Mode

```javascript
// theme/darkTheme.js
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3A41C7' },
  },
  typography: {
    fontFamily: FONT_FAMILY, // ใช้ font เดิม
  },
});
```

**การใช้งาน:**
```jsx
const [darkMode, setDarkMode] = useState(false);

<ThemeProvider theme={darkMode ? darkTheme : theme}>
  <App />
</ThemeProvider>
```

---

## 📊 ผลลัพธ์ที่ได้

### ✅ Consistency

- **100%** ของ MUI components ใช้ขวานทอง
- **100%** ของ HTML/Tailwind elements ใช้ขวานทอง
- **0** hardcoded font names ใน components

### ✅ Maintainability

- แก้ font: แก้ **2 files** (config + theme)
- เพิ่ม variant: แก้ **1 file** (index.css)
- Switch theme: แก้ **1 file** (main.jsx)

### ✅ Developer Experience

- ไม่ต้องคิดเรื่อง font เมื่อเขียน component
- Import ง่าย: `import { theme } from '@/theme'`
- Documentation ชัดเจน (อ่านไฟล์นี้เข้าใจทั้งระบบ)

### ✅ Performance

- Font โหลดครั้งเดียวที่ `index.css`
- ThemeProvider wrap ครั้งเดียวที่ root
- ไม่มี inline styles ซ้ำซ้อน

---

## 🎓 บทเรียนสำคัญ

### 1. MUI และ Tailwind ไม่ได้ share styling system

- Tailwind = CSS classes → HTML elements
- MUI = JS styles → React components
- **ต้อง configure แยกกัน** แต่ใช้ค่าเดียวกัน

### 2. Theme ≠ Component Logic

- Component ไม่ควรรู้เรื่อง font, color, spacing
- ควรอ่านจาก theme ผ่าน ThemeProvider
- Separation of Concerns = maintainability

### 3. Single Source of Truth

- Font family stack ควรอยู่ที่เดียว (config)
- ทุก system (Tailwind, MUI) ควรอ้างอิงค่าเดียวกัน
- แก้ครั้งเดียว ใช้ได้ทุกที่

---

## 📚 Related Files

- `/src/theme/muiTheme.js` - MUI theme configuration
- `/src/theme/index.js` - Theme exports
- `/src/index.css` - Font loading และ Tailwind import
- `/src/main.jsx` - ThemeProvider wrapper
- `/tailwind.config.js` - Tailwind font configuration

---

**สร้างขึ้นเพื่อ maintainability และ long-term scalability ของโปรเจค**
