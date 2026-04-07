import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        surface: "var(--surface)",
        "surface-50": "var(--surface-50)",
        "surface-100": "var(--surface-100)",
        "surface-200": "var(--surface-200)",
        "color-pop": "var(--color-pop)",
        "color-tiktok": "var(--color-tiktok)",
        "color-instagram": "var(--color-instagram)",
        "color-youtube": "var(--color-youtube)",
        "color-spotify": "var(--color-spotify)",
      },
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
        display: ["N27", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
