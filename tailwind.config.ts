import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B1D35',
        amber: {
          DEFAULT: '#E8A020',
          400: '#f0b43a',
        },
        green: {
          DEFAULT: '#0D9E6E',
        },
        slate: {
          DEFAULT: '#F4F6F9',
        },
        mid: '#8899AA',
        border: '#DDE3EA',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'Arial Narrow', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
