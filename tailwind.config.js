/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.html"],
  theme: {
    screens: {
      'sm': '320px', // iPhone SE
      'md': '768px', // iPad Mini
      'lg': '1024px', // Large screens
      'xl': '1280px', // Extra large screens
    },
    extend: {},
  },
  plugins: [],
}
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/index.html"],
//   theme: {
//         extend: {},
//   },
//   plugins: [],
// }

