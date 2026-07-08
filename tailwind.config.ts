import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4F0E5',
        navy: '#16263F',
        // Logo duotone: coral = warm/taste/CTA, blue = info/schedule/logistics.
        // Bright values are for fills; "-deep" values are legible on cream text.
        coral: '#E9694E',
        'coral-deep': '#C9553C',
        blue: '#48B4D6',
        'blue-deep': '#1E5F7A',
        'text-muted': '#A6AEC0',
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
