import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:  '#F97316',
          'orange-hover': '#EA6C0A',
          amber:   '#F59E0B',
          cream:   '#FEF3C7',
          brown:   '#92400E',
          'border-light': '#FFEDD5',
        },
      },
      maxWidth: {
        container: '1100px',
      },
    },
  },
  plugins: [],
}

export default config
