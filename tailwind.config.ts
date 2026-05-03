import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        offwhite: '#f4f0e8',
        cream: '#ede8dc',
        amber: '#e8a020',
        'amber-light': '#f5c254',
        'amber-dim': '#7a5010',
        text: '#1a1a1a',
        muted: '#6b6560',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        newsreader: ['var(--font-newsreader)', 'serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text'),
            h1: { color: theme('colors.text'), fontFamily: 'var(--font-syne)' },
            h2: { color: theme('colors.text'), fontFamily: 'var(--font-syne)' },
            h3: { color: theme('colors.text'), fontFamily: 'var(--font-syne)' },
            strong: { color: theme('colors.text') },
            a: {
              color: theme('colors.amber'),
              '&:hover': { color: theme('colors.amber-light') },
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
