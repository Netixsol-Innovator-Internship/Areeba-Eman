/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // App Router
    "./pages/**/*.{js,ts,jsx,tsx}",     // Pages Router (if used)
    "./components/**/*.{js,ts,jsx,tsx}" // Components
  ],
  theme: {
    extend: {},
  },
  future: {
    disableColorFunctionalNotation: true, // ✅ disable oklch() output
  },
  plugins: [],
};
