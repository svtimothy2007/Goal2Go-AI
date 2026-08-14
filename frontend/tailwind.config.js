/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0E16",
          soft: "#0D1220",
        },
        surface: {
          DEFAULT: "#121826",
          alt: "#1A2233",
          border: "#232C3D",
        },
        ink: {
          DEFAULT: "#E7ECF3",
          muted: "#8B96AB",
          faint: "#5A6478",
        },
        signal: {
          DEFAULT: "#45E0D5",
          dim: "#1F6E68",
          glow: "#7CF5EC",
        },
        amber: {
          DEFAULT: "#F2B84B",
          dim: "#6E5423",
        },
        okgreen: {
          DEFAULT: "#3ED598",
          dim: "#1E6E4C",
        },
        alert: {
          DEFAULT: "#F0616B",
          dim: "#6E2830",
        },
        paper: {
          DEFAULT: "#F6F4EE",
          panel: "#FFFFFF",
          border: "#DEDACF",
          ink: "#171A21",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(69,224,213,0.35), 0 0 24px rgba(69,224,213,0.25)",
      },
      animation: {
        pulseSlow: "pulseSlow 2.4s ease-in-out infinite",
        pulseFast: "pulseSlow 1s ease-in-out infinite",
        flow: "flow 1.6s linear infinite",
        fadeUp: "fadeUp 0.35s ease-out",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.45 },
        },
        flow: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 40px" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
