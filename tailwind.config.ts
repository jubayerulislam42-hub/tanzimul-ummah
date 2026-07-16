import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-black": "#0A1F16",
        primary: {
          DEFAULT: "#0F6B3C",
          light: "#15884D",
          dark: "#122A20",
        },
        "primary-dark": {
          DEFAULT: "#122A20",
          light: "#1B3D2E",
        },
        "accent-gold": {
          DEFAULT: "#D4A537",
          light: "#E6C067",
          dark: "#B8872A",
        },
        navy: {
          DEFAULT: "#1B2A4A",
          light: "#2A3E68",
        },
        cream: "#F5F1E8",
        "off-white": "#FAF8F3",
        charcoal: "#2D2D2D",
      },
      fontFamily: {
        bengali: ["var(--font-hind-siliguri)", "sans-serif"],
        "bengali-serif": ["var(--font-noto-serif-bengali)", "serif"],
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 0 1px rgba(212,165,55,0.3), 0 8px 30px -8px rgba(212,165,55,0.25)",
        card: "0 4px 24px -6px rgba(10,31,22,0.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
