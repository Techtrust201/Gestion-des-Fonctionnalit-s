/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        // Couleurs principales
        primary: {
          DEFAULT: "#0F172A", // Un Navy foncé
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#F1F5F9", // Gris clair
          foreground: "#0F172A", // Navy
        },
        destructive: {
          DEFAULT: "#EF4444", // Rouge
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FF8C00", // Orange
          foreground: "#ffffff",
        },
        // gris par défaut
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
};
