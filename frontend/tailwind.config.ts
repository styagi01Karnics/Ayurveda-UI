import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ayur: {
          gold: '#B8860B',
          'gold-dark': '#8B6914',
          'gold-light': '#D4A017',
          cream: '#FAF6EE',
          'cream-dark': '#F0E8D6',
          'cream-deeper': '#E8DCC4',
          brown: '#2D1B00',
          'brown-mid': '#6B4C1E',
          'brown-light': '#9C7040',
          green: '#4A7C4E',
          'green-light': '#6aab6e',
          border: '#EDE5D0',
          bg: '#F5EFE0',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ayur: '0 2px 8px rgba(184, 134, 11, 0.12)',
        'ayur-lg': '0 8px 24px rgba(184, 134, 11, 0.16)',
      },
    },
  },
  plugins: [],
} satisfies Config;
