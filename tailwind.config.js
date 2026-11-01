/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.html",
    "./src/**/*.{html,js,ts,jsx,tsx,cjs}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
