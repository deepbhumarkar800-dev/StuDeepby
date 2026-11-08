import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#174D3C",
        botanical: "#246B50",
        emerald: "#398564",
        sage: "#78977C",
        mint: "#B9D6BD",
        palemint: "#E4F1E4",
        ivory: "#F7F8EF",
        cream: "#F0F3DF",
        ink: "#19392E",
        muted: "#718579",
        line: "#C7D9C9",
      },
      fontFamily: {
        heading: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-unbounded)", "var(--font-sora)", "ui-rounded", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 30px 50px -26px rgba(23,77,60,.6), inset 0 1px 0 rgba(255,255,255,.35)",
        soft: "0 14px 30px -20px rgba(23,77,60,.45)",
        lift: "0 22px 40px -22px rgba(23,77,60,.5)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0) rotate(var(--r,0deg))" },
          "50%": { transform: "translateY(-9px) rotate(var(--r,0deg))" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
