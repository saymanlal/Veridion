/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zinc: {
          450: '#9a9aa2',
          455: '#97979f',
          750: '#3a3a40',
          850: '#19191c',
        },
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
};
