import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        vermilion: "#ce181e",
        cypress: "#111111",
        "bayou-blue": "#3f3f46",
        "field-gold": "#e5e7eb",
        paper: "#f7f7f8"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(17, 17, 17, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
