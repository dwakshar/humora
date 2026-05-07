export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
      },
      colors: {
        indigo: {
          DEFAULT: '#4F46E5',
          hover:   '#4338CA',
          light:   '#EEF2FF',
          dark:    '#3730A3',
        }
      },
      animation: {
        'marquee':          'marquee 20s linear infinite',
        'marquee-reverse':  'marquee 25s linear infinite reverse',
        'pulse-ring':       'pulse-ring 2s ease-out infinite',
        'count-up':         'count-up 2s ease-out forwards',
        'spin-slow':        'spin 0.8s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      boxShadow: {
        'indigo':    '0 8px 24px rgba(79,70,229,0.25)',
        'indigo-lg': '0 16px 48px rgba(79,70,229,0.35)',
      }
    }
  },
  plugins: []
}
