/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  // Use class strategy so toggling the `dark` class works
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
