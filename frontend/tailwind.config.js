/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c65c8', // Your signature dashboard blue
        success: '#10b981', // Your active/green color
        danger: '#ef4444',  // Your error/red color
      }
    },
  },
  plugins: [],
}