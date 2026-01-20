/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				mono: ['"JetBrains Mono Variable"', 'monospace'], 
				sans: ['"Outfit Variable"', 'sans-serif'],
			},
			colors: {
                'pycon-dark': '#0F172A',   // Slate 900
        'pycon-warm-dark': '#1C1514', // Un negro con tinte rojizo/marrón
        'pycon-orange': '#F06449',  },
		},
	},
	plugins: [],
}