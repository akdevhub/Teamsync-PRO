/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          dark: '#FFFFFF',
        },
        success: {
          DEFAULT: '#0F7B6C',
          dark: '#4A9C8D',
        },
        warning: {
          DEFAULT: '#D9730D',
          dark: '#D9730D',
        },
        danger: {
          DEFAULT: '#E03E3E',
          dark: '#E03E3E',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#191919',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#202020',
        },
        sidebar: {
          dark: '#202020',
        },
        border: {
          DEFAULT: '#E9E9E7',
          dark: '#2F2F2F',
        },
        text: {
          main: '#37352F',
          mainDark: '#FFFFFF',
          muted: '#9B9A97',
          mutedDark: '#9B9B9B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
