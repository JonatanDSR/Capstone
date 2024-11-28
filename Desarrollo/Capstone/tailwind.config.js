/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF9900',
          50: '#FFF5E6',
          100: '#FFE5BF',
          200: '#FFD699',
          300: '#FFC266',
          400: '#FFAD33',
          500: '#FF9900',
          600: '#CC7A00',
          700: '#995C00',
          800: '#663D00',
          900: '#331F00',
        },
        secondary: {
          DEFAULT: '#4A4A4A',
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#4A4A4A',
          600: '#3B3B3B',
          700: '#2D2D2D',
          800: '#1E1E1E',
          900: '#0F0F0F',
        },
      },
    },
  },
  plugins: [],
};