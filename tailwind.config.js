/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        fontFamily: {
            // Make KhwanThongCard THE default sans font
            // This replaces the default sans-serif stack
            sans: ['KhwanThongCard', ...defaultTheme.fontFamily.sans],
        },
        extend: {
            fontFamily: {
                // Additional explicit font family utility
                khwanthong: ['KhwanThongCard', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
};
