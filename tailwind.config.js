/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50:  "#f0fdf7",
          100: "#dcfce9",
          200: "#bbf7d2",
          300: "#86efb2",
          400: "#4ade82",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          to: { transform: "translateY(-20px) scale(1.1)" },
        },
      },
    },
  },
  plugins: [],
};
