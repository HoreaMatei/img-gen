/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      opacity: {
        15: "0.15",
        35: "0.35",
        65: "0.65",
      },
    },
  },
  plugins: [],
};
