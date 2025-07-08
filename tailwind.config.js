/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'blue': {
          700: '#1D4ED8', // Ensuring WCAG AA compliance
          800: '#1E40AF',
        },
        'gray': {
          700: '#374151', // Better contrast for text
        }
      },
    },
  },
  plugins: [],
};

