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
        mbc: {
          blue: "#003087",
          red: "#c8102e",
          gold: "#f5a623",
          dark: "#0a0a1a",
          darker: "#050510",
          glow: "#4f46e5",
        },
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "eq-bar": "eqBar 0.8s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 4s ease infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" },
          "50%": { boxShadow: "0 0 60px rgba(79, 70, 229, 0.8), 0 0 100px rgba(79, 70, 229, 0.4)" },
        },
        eqBar: {
          "0%": { height: "20%" },
          "100%": { height: "100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
