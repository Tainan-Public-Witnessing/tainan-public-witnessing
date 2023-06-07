const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    screens: {
      sm: "600px",
      md: "960px",
      lg: "1280px",
      xl: "1920px",
    },
    colors: {
      ...colors,
      primary: "#3f51b5",
      accent: "#9e9e9e",
      warn: "#f44336",
      white: "#ffffff",
      inherit: "inherit",
      hovered: "#0000000a",
    },
  },
  plugins: [],
  important: true,
};
