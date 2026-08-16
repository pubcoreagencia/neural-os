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
        ink: {
          950: "#030407",
          900: "#080b10",
          800: "#111620",
          700: "#1a2330"
        },
        neural: {
          cyan: "#56e4ff",
          blue: "#2e7dff",
          violet: "#8c6dff",
          mint: "#7fffd4",
          silver: "#d9e7ef"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "Geist",
          "Satoshi",
          "IBM Plex Sans",
          "Segoe UI",
          "system-ui",
          "sans-serif"
        ],
        display: [
          "Space Grotesk",
          "Geist",
          "Inter",
          "Segoe UI",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 0 64px rgba(86, 228, 255, 0.18)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(255,255,255,.04)"
      },
      backgroundImage: {
        "radial-grid": "radial-gradient(circle at center, rgba(86,228,255,.18) 0, transparent 34%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" }
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        breathe: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        scan: "scan 4.8s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
