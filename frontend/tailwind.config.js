import tailwindScrollbarHide from "tailwind-scrollbar-hide";

const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: token("ink"),
        night: token("night"),
        panel: token("panel"),
        raised: token("raised"),
        ivory: token("ivory"),
        mute: token("mute"),
        champagne: token("champagne"),
        ember: token("ember"),
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "Times New Roman", "serif"],
        sans: ["Manrope", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        label: "0.22em",
      },
      transitionTimingFunction: {
        cine: "cubic-bezier(0.22, 0.8, 0.24, 1)",
      },
      maxWidth: {
        frame: "1480px",
      },
    },
  },
  plugins: [tailwindScrollbarHide],
};
