# KhwanThong-Card Font Integration

## ✅ Installation Complete

KhwanThong-Card font has been successfully integrated as the **default font** for the entire application.

---

## 📁 File Structure

```
src/
├── assets/
│   └── fonts/
│       ├── KhwanThong-Card-Regular.ttf       ← Default Primary
│       ├── KhwanThong-Card-Bold.ttf
│       ├── KhwanThong-Card-Italic.ttf
│       ├── KhwanThong-Card-BoldItalic.ttf
│       ├── KhwanThong-Card-Light.ttf
│       └── KhwanThong-Card-LightItalic.ttf
├── index.css                                  ← @font-face definitions
└── main.jsx                                   ← CSS import
```

---

## 🎨 Font Weights & Styles

| Weight | Style | Class | Font File |
|--------|-------|-------|-----------|
| 300 | Normal | `font-light` | KhwanThong-Card-Light.ttf |
| 300 | Italic | `font-light italic` | KhwanThong-Card-LightItalic.ttf |
| 400 | Normal | `font-normal` or default | **KhwanThong-Card-Regular.ttf** |
| 400 | Italic | `italic` | KhwanThong-Card-Italic.ttf |
| 700 | Normal | `font-bold` | KhwanThong-Card-Bold.ttf |
| 700 | Italic | `font-bold italic` | KhwanThong-Card-BoldItalic.ttf |

---

## 🚀 Usage

### Automatic (Default)

All text automatically uses KhwanThong-Card-Regular:

```jsx
<p>ข้อความภาษาไทย - Thai Text</p>
// Already using KhwanThong-Card-Regular
```

### Tailwind Utilities

```jsx
// Default sans font (already KhwanThongCard)
<p className="font-sans">ข้อความ</p>

// Explicit KhwanThong font
<p className="font-khwanthong">ข้อความ</p>

// Font weights
<p className="font-light">น้ำหนักเบา</p>
<p className="font-normal">น้ำหนักปกติ</p>
<p className="font-bold">น้ำหนักหนา</p>

// Italic
<p className="italic">ตัวเอียง</p>
<p className="font-bold italic">หนาและเอียง</p>
```

### CSS

```css
/* Already applied globally in body */
font-family: 'KhwanThongCard', system-ui, sans-serif;

/* Or use explicitly */
.my-class {
  font-family: 'KhwanThongCard';
  font-weight: 700; /* Bold */
  font-style: italic;
}
```

---

## 🧪 Testing

Visit the font test page:

```
http://localhost:5174/font-test
```

This page demonstrates:
- ✅ All font weights (Light, Regular, Bold)
- ✅ All font styles (Normal, Italic)
- ✅ Various text sizes
- ✅ Thai and English characters
- ✅ Sample content

---

## 📝 Configuration Files

### `src/index.css`

```css
@import "tailwindcss";

/* All @font-face declarations for KhwanThongCard */
/* Global body font-family setting */
```

### `tailwind.config.js`

```js
export default {
  theme: {
    fontFamily: {
      sans: ['KhwanThongCard', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      fontFamily: {
        khwanthong: ['KhwanThongCard', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
```

---

## ✨ Features

- ✅ **Default font** for entire application
- ✅ **6 font variants** (Light, Regular, Bold + Italic versions)
- ✅ **Tailwind integration** with `font-sans` and `font-khwanthong`
- ✅ **Thai language support** with beautiful rendering
- ✅ **Font-display: swap** for optimal performance
- ✅ **Fallback fonts** included for reliability

---

## 🔧 Troubleshooting

### Font not loading?

1. Check browser console for 404 errors
2. Verify font files exist in `src/assets/fonts/`
3. Clear browser cache
4. Restart dev server

### Font looks different?

1. Check if another CSS rule is overriding
2. Inspect element in DevTools
3. Verify computed font-family shows 'KhwanThongCard'

---

## 📦 Font License

Please ensure you have proper licensing for KhwanThong-Card font usage in your project.

---

**Font Integration Date:** December 6, 2025  
**Status:** ✅ Production Ready
