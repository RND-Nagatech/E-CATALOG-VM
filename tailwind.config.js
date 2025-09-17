/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'custom1375': '1375px',
        'ultra-wide': '1626px',
        'ultra-wide-2x': '1920px',
      },
    },
  },
  plugins: [],
};
