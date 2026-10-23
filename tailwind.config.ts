import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#FAF9F5',
        'surface-subtle': '#F3F1EB',
        card: '#FFFFFF',
        'card-elevated': '#FFFFFF',
        border: '#E5E2DC',
        'border-subtle': '#EDEAE4',
        primary: '#090A0D',
        secondary: '#4A505C',
        muted: '#808794',
        accent: '#FF5500',
        'accent-hover': '#E04B00',
        'accent-subtle': '#FFF4ED',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        container: '1240px',
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter: '-0.025em',
        tight: '-0.015em',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        glow: '0 0 24px -2px rgba(255, 85, 0, 0.25)',
        'glow-lg': '0 0 45px -5px rgba(255, 85, 0, 0.35)',
        card: '0 12px 32px -4px rgba(9, 10, 13, 0.05), 0 4px 12px -2px rgba(9, 10, 13, 0.02)',
      }
    },
  },
  plugins: [],
} satisfies Config

