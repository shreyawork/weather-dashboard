/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.html"],
  theme: {
    screens: {
      "sm": "320px", // IphoneSE
      "md": "768px", //Ipadmini
     "lg": "1024px", // largescreen
     "xl": "1280px", // extralargescreen
    },
    extend: {},
  },
  plugins: [],
}

