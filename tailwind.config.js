/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#2f3036',
        background: '#ffffff',
        blue: {
          50: '#F0F7FF',
          100: '#E6F0FF',
          200: '#D1E2FF',
          300: '#B2CDFF',
          400: '#84ADFF',
          500: '#5B8DEF',
          600: '#2563EB',
          700: '#2668F0',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
    },
  },
  plugins: [],
};
