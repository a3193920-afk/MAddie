/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f2f7f5',
          100: '#e1ede7',
          200: '#c5ddd1',
          300: '#9ec4b3',
          400: '#73a591',
          500: '#528974',
          600: '#3e6e5c',
          700: '#34584b',
          800: '#2b473d',
          900: '#253c34',
          950: '#13211d',
        },
        sand: {
          50: '#faf9f6',
          100: '#f4f2ec',
          200: '#eae5d9',
          300: '#dad1bf',
          400: '#c4b59f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
