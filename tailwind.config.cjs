/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'thril-red': '#ed202a',
        'thril-grey-dark': '#2f424b',
        'thril-red-dark': '#8b0c12',
        'thril-grey-light': '#aec2cc',
        'thril-red-light': '#f89ea2',
        'thril-grey': '#6f8c97',
        'thrilRed': '#ed202a',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
