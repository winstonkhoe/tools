import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          black: '#111111',
          grey: '#2F2F2F',
          white: '#F6F6F6',
          yellow: {
            100: '#FFCB74',
            200: '#FFAE28',
            300: '#DB8800',
          },
          green: {
            100: '#e9edc9',
            200: '#ccd5ae',
            300: '#a8ba8f',
            400: '#8ba873',
            500: '#6e8c57',
            600: '#52703b',
            700: '#395222',
            800: '#233a0d',
            900: '#0d1f00',
          },
          red: {
            100: '#f8ad9d',
            200: '#f4978e',
            300: '#f08080',
          }
        }
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      }
    },
  },
  plugins: [
    require('autoprefixer'),
    require('tailwind-scrollbar'),
  ],
}
export default config
