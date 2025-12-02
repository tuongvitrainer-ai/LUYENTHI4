/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Bạn có thể thêm custom colors, spacing, etc. ở đây
      colors: {
        // Ví dụ: match với theme hiện tại
        'primary': '#4DA6FF',
        'primary-light': '#87CEEB',
        'primary-dark': '#3182CE',
      },
    },
  },
  plugins: [],
  // QUAN TRỌNG: Tắt preflight để không conflict với Ant Design
  corePlugins: {
    preflight: false,
  },
}
