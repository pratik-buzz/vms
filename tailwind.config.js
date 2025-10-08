/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      colors: {
        'primary': '#344054',
        'purple': '#7F56D9',
        'secondary': '#6941C6',
        'tertiary': '#5837D5',
        'quaternary': '#4927D4',
        'quinary': '#3A16D3',
      }
    },
  },
  plugins: [],
};
