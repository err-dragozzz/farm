import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px"
      }
    },

    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground:
            "hsl(var(--primary-foreground))"
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground:
            "hsl(var(--secondary-foreground))"
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground:
            "hsl(var(--muted-foreground))"
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground:
            "hsl(var(--accent-foreground))"
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground:
            "hsl(var(--destructive-foreground))"
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground:
            "hsl(var(--card-foreground))"
        },

        // PREMIUM COLORS
        farm: {
          green: "#22c55e",
          lime: "#84cc16",
          dark: "#081018",
          forest: "#052e16",
          emerald: "#10b981",
          sky: "#0ea5e9",
          soil: "#78350f"
        }
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",

        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },

      boxShadow: {
        soft:
          "0 18px 50px rgba(9,30,28,0.08)",

        lift:
          "0 12px 28px rgba(24,70,57,0.12)",

        // PREMIUM SHADOWS
        glow:
          "0 0 40px rgba(34,197,94,0.18)",

        emerald:
          "0 0 60px rgba(16,185,129,0.22)",

        glass:
          "0 8px 40px rgba(0,0,0,0.35)",

        floating:
          "0 20px 60px rgba(0,0,0,0.45)"
      },

      backgroundImage: {
        // PREMIUM GRADIENTS
        "farm-gradient":
          "linear-gradient(135deg,#22c55e 0%,#84cc16 100%)",

        "dark-gradient":
          "linear-gradient(180deg,#081018 0%,#0f172a 100%)",

        "glass-gradient":
          "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))",

        "hero-glow":
          "radial-gradient(circle at top left, rgba(34,197,94,0.18), transparent 35%)"
      },

      backdropBlur: {
        xs: "2px"
      },

      keyframes: {
        // FLOAT
        float: {
          "0%, 100%": {
            transform: "translateY(0px)"
          },

          "50%": {
            transform: "translateY(-8px)"
          }
        },

        // GLOW PULSE
        glow: {
          "0%, 100%": {
            opacity: "0.7"
          },

          "50%": {
            opacity: "1"
          }
        },

        // FADE UP
        "fade-up": {
          "0%": {
            opacity: "0",
            transform:
              "translateY(16px)"
          },

          "100%": {
            opacity: "1",
            transform:
              "translateY(0)"
          }
        },

        // SCALE IN
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)"
          },

          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        }
      },

      animation: {
        float:
          "float 6s ease-in-out infinite",

        glow:
          "glow 3s ease-in-out infinite",

        "fade-up":
          "fade-up 0.6s ease-out",

        "scale-in":
          "scale-in 0.4s ease-out"
      }
    }
  },

  plugins: [animate]
};

export default config;

