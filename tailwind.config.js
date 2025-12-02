/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        space: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617', 
        },
        neon: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
        'radial-highlight': "radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)"
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
        'glow-sm': '0 0 8px rgba(59, 130, 246, 0.2)',
      }
    },
  },
  plugins: [],
}