// tailwind.config.js
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ขยาย theme ถ้ามี
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    // plugin อื่น ๆ ใส่ต่อท้ายได้
  ],
};
