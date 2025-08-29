/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#d9eaff',
          200: '#b3d4ff',
          300: '#80b6ff',
          400: '#4d97ff',
          500: '#1a78ff',
          600: '#0a5fe6',
          700: '#084db8',
          800: '#06398a',
          900: '#04255c'
        }
      }
    }
  },
  plugins: []
};
