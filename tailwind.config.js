/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./ar.html",
    "./*.html",
    "./src/**/*.{html,js,ts,jsx,tsx,cjs}",
    "./scripts/**/*.{js,cjs}",
    "./public/**/*.html"
  ],
  safelist: [
    'bg-[#D7C797]',
    'bg-[#D7C797]/30',
    'bg-white',
    'bg-white/30',
    'border-[#D7C797]',
    'border-[#D7C797]/60',
    'scale-110',
    'text-white',
    'text-white/90',
    'hover:text-[#D7C797]',
    'text-3xl',
    'md:text-4xl',
    'font-light',
    'cursor-pointer',
    'transition-colors',
    'opacity-0',
    'opacity-30',
    'opacity-70',
    'opacity-100',
    'pointer-events-none',
    'pointer-events-auto',
    'hidden',
    'overflow-hidden'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
