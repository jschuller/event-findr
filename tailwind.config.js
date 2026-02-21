/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/calendarkit-basic/dist/**/*.{js,mjs}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
