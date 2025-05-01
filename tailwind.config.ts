import type { Config } from "tailwindcss"

const { fontFamily } = require("tailwindcss/defaultTheme")

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          20: "rgb(var(--primary-20) / <alpha-value>)",
          100: "rgb(var(--primary-100) / <alpha-value>)",
          light: "rgb(var(--primary-light) / <alpha-value>)",
        },
        red: "rgb(var(--red) / <alpha-value>)",
        green: "rgb(var(--green) / <alpha-value>)",
        dark: {
          20: "rgb(var(--dark-20) / <alpha-value>)",
          40: "rgb(var(--dark-40) / <alpha-value>)",
          80: "rgb(var(--dark-80) / <alpha-value>)",
          100: "rgb(var(--dark-100) / <alpha-value>)",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: {
            transform: "translateX(0%)",
          },
          to: {
            transform: "translateX(-100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 25s 2s linear infinite",
      },
      backgroundImage: {
        "primary-linear": "linear-gradient(94.12deg, #3C7BFD 0%, #6496FE 100%)",
        "primary-linear-light": "linear-gradient(#6496FE, #6496FE)",
      },
      boxShadow: {
        "drop-shadow": "0px 0px 16px 0px rgba(164, 211, 255, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
