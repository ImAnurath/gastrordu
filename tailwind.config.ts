import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4F0E5',
        navy: '#16263F',
        olive: '#5C7A2E',
        'olive-deep': '#435C20',
        bronze: '#B07A33',
        'olive-light': '#9DB36A',
        'text-muted': '#A6AEC0',
        'green-dark-2': '#4A6322',
        'green-dark-3': '#3A4F1B',
        'green-dark-4': '#2E3F16',
        'green-very-dark': '#23310F',
        'olive-dark-light': '#CBD9A6',
      },
      fontFamily: {
        heading: ['var(--font-archivo)', 'sans-serif'],
        script: ['var(--font-dancing)', 'cursive'],
        body: ['var(--font-source-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
