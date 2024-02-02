import { type Config } from 'tailwindcss'

import { type PluginAPI } from 'tailwindcss/types/config'
import animatePlugin from 'tailwindcss-animate'
import radixPlugin from 'tailwindcss-radix'
import { marketingPreset } from '#app/routes/_marketing+/tailwind-preset'
import { menuPreset } from '#app/routes/try/tailwind-preset.ts'
import { extendedTheme } from './app/utils/extended-theme.ts'

const plugin = require('tailwindcss/plugin')

export default {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	darkMode: 'class',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},

		extend: extendedTheme,
	},
	variants: {
		extend: {
			boxShadow: ['dark'], // enable dark variant for boxShadow
		},
	},
	presets: [marketingPreset, menuPreset],
	plugins: [
		animatePlugin,
		radixPlugin,
		plugin(function ({ addUtilities }: PluginAPI) {
			const newUtilities = {
				'.transform-origin-center': {
					'transform-origin': 'center',
				},
			}
			addUtilities(newUtilities)
		}),
	],
} satisfies Config
