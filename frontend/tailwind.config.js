/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#174D32',
          50: '#F0F6F2',
          100: '#DCEADF',
          200: '#BAD5C1',
          300: '#92BDA0',
          400: '#63A66B',
          500: '#3D8550',
          600: '#27683E',
          700: '#1D5A37',
          800: '#174D32', // Specified Forest Green
          900: '#103824',
          950: '#092115',
        },
        leaf: {
          DEFAULT: '#63A66B', // Specified Leaf Green
          light: '#88C28F',
          dark: '#4B8852',
        },
        cream: {
          DEFAULT: '#F7F8EF', // Specified Light Cream
          50: '#FDFDFB',
          100: '#F7F8EF',
          200: '#EBEED7',
          300: '#DDE2BE',
        },
        gold: {
          DEFAULT: '#E5B64B', // Specified Harvest Gold
          light: '#ECC772',
          dark: '#C89627',
        },
        dark: {
          DEFAULT: '#202B24', // Specified Dark Text
          muted: '#4A5B50',
          subtle: '#78897E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(99, 166, 107, 0.25)',
        'glow': '0 0 25px -4px rgba(23, 77, 50, 0.35)',
        'glow-gold': '0 0 20px -3px rgba(229, 182, 75, 0.35)',
        'premium': '0 10px 30px -10px rgba(23, 77, 50, 0.12), 0 4px 6px -2px rgba(23, 77, 50, 0.04)',
      }
    },
  },
  plugins: [],
}
