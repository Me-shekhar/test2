module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        risk: {
          green: "#10b981",
          yellow: "#f59e0b",
          red: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
