/* eslint-disable prettier/prettier */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      maxWidth: {
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
      },
      maxHeight: {
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
      },
    },
    colors: {
      "opacity-black-75": "rgba(0,0,0,0.75)",
      "opacity-white-05": "rgba(255,255,255,0.05)",
      transparent: "rgba(255,255,255,0)",
      white: "#FFF",
      gray: {
        100: "#E1E1E6",
        300: "#C4C4CC",
        400: "#8D8D99",
        500: "#7C7C8A",
        600: "#323238",
        700: "#29292E",
        800: "#202024",
        900: "#121214",
      },
      green: {
        300: "#00B37E",
        500: "#00875F",
        700: "#015F43",
      },
      red: {
        500: "#AB222E",
        700: "#7A1921",
      },
      yellow: {
        500: "#FBA94C",
      },
    },
  },
  plugins: [],
};
