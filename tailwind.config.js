/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        plak: ['"Neue Plak Wide"', "sans-serif"],
        antebas: ['"Antebas"', "cursive"],
      },
    },
  },
  plugins: [],
};
