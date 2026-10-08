/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fbf3ea",
        "cream-2": "#f5e7d6",
        blush: "#f3d9d3",
        "blush-2": "#e9b9b6",
        rose: "#c9767a",
        "rose-deep": "#a8555c",
        gold: "#c9a15a",
        "gold-light": "#e3c483",
        brown: "#4a2f28",
        "brown-soft": "#8a6a5c",
      },
      fontFamily: {
        script: ['"Cormorant Garamond"', "serif"],
        display: ['"Italiana"', "serif"],
        body: ['"Marcellus"', "serif"],
      },
      boxShadow: {
        soft: "0 30px 60px rgba(74,47,40,0.14)",
        photo: "0 20px 40px rgba(74,47,40,0.18)",
      },
      keyframes: {
        fall: {
          "0%": { transform: "translateY(-10vh) translateX(0) rotate(0deg)" },
          "100%": { transform: "translateY(110vh) translateX(40px) rotate(360deg)" },
        },
        heroZoom: {
          from: { transform: "scale(1.02)" },
          to: { transform: "scale(1.07)" },
        },
        cueMove: {
          "0%": { top: "0", opacity: "1" },
          "90%": { opacity: "0" },
          "100%": { top: "40px", opacity: "0" },
        },
      },
      animation: {
        fall: "fall linear infinite",
        heroZoom: "heroZoom 24s ease-in-out infinite alternate",
        cueMove: "cueMove 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
