/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono Variable"', 'monospace'],
        outfit: ['"Outfit Variable"', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      colors: {
        'pycon-yellow': {
          DEFAULT: '#FFC72C',
          100: '#FFC72C',
          75: '#FFD560',
          50: '#FFE395',
          25: '#FFF1CA',
        },
        'pycon-orange': {
          DEFAULT: '#FF8200',
          100: '#FF8200',
          75: '#FFA13F',
          50: '#FFC07F',
          25: '#FFDFBF',
        },
        'pycon-red': {
          DEFAULT: '#F9423A',
          100: '#F9423A',
          75: '#FA716B',
          50: '#FCA09C',
          25: '#FDCFCD',
        },
        'pycon-black': {
          DEFAULT: '#1D1D1B',
          100: '#1D1D1B',
          75: '#555554',
          50: '#8E8E8D',
          25: '#C6C6C6',
        },
      },
    },
  },
  plugins: [],
}
