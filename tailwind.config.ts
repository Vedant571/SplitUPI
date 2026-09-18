import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#06b6d4",
          hover: "#0891b2",
          foreground: "#ffffff",
        },
        navy: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
        }
      },
    },
  },
  plugins: [],
};

export default config;
