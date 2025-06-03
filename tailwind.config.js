/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dotgothic': ['DotGothic16', 'MS Gothic', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
