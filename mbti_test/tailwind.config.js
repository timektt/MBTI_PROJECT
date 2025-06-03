// tailwind.config.js
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    // ... ของคุณ
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ถ้ามีขยาย theme อะไรเพิ่มเติมส
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@tailwindcss/line-clamp"),
    // ถ้ามี plugin อื่น ๆ ก็เรียงต่อได้
  ],
};
