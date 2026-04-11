/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
      },
      colors: {
        indigo: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          light: "#EEF2FF",
        },
      },
    },
  },
  plugins: [],
};
