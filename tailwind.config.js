/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rice: {
          50: "#FFFCF6",
          100: "#FDF7ED",
          200: "#F8EFDE",
          300: "#F2E4C8",
          400: "#E9D4AA",
          500: "#D9BE83",
        },
        ink: {
          50: "#F6F6F6",
          100: "#E7E7E7",
          200: "#CFCFCF",
          300: "#A7A7A7",
          400: "#6A6A6A",
          500: "#3B3B3B",
          600: "#232323",
          700: "#171717",
          800: "#0F0F0F",
          900: "#0A0A0A",
        },
        accent: {
          pink: "#FF6FAE",
          sky: "#4CC9F0",
          yellow: "#FFD166",
        },
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.10)",
      },
    },
  },
  plugins: [],
}
