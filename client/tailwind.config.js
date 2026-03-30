/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // blue-500
        secondary: '#60a5fa', // blue-400
        accent: '#f59e0b', // amber-500
        dark: '#1f2937', // gray-800
        light: '#f9fafb', // gray-50
        'light-gray': '#e5e7eb', // gray-200
        success: '#10b981', // green-500
        error: '#ef4444', // red-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
