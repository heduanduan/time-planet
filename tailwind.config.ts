import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cosmic-purple": "#8B5CF6",
        "cosmic-blue": "#3B82F6",
        "cosmic-gold": "#FFDF00",
        "cosmic-pink": "#F472B6",
        "cosmic-dark": "#0A0B1E",
        "cosmic-deep": "#121330",
        "cosmic-glass": "rgba(255,255,255,0.06)",
        "cosmic-border": "rgba(139,92,246,0.25)",
        "cosmic-green": "#4ADE80",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "cosmic-glow": "0 0 20px rgba(139,92,246,0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-cosmic": "linear-gradient(to bottom, #0A0B1E, #121330)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;