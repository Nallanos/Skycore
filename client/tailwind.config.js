/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skylume: {
          primary: '#1DA1F2',
          secondary: '#14171A',
          accent: '#657786',
          light: '#AAB8C2',
          background: '#F7F9FA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}