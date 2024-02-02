import * as NavigationMenu from '#node_modules/@radix-ui/react-navigation-menu'
import React from 'react'
import { pages } from '#app/components/MenuBar/constants.ts'
import MenuItem from './components/MenuItem.tsx'

export default function MenuBar() {
	return (
		<NavigationMenu.Root className="relative z-[1] flex items-center justify-center rounded-b-xl bg-background py-5 shadow-top-bar">
			<img
				className="absolute left-[39px] top-[30px] h-9 w-40"
				src="https://via.placeholder.com/154x37"
			/>
			<NavigationMenu.List className="align-center flex inline-flex items-center justify-center gap-5">
				{pages.map(({ title, to, subItems }) => (
					<MenuItem title={title} to={to} key={to} subItems={subItems} />
				))}
			</NavigationMenu.List>
			<div className="absolute left-0 top-full flex w-full justify-center bg-transparent perspective-[2000px]">
				<NavigationMenu.Viewport className="relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-transparent transition-[width,_height] duration-300 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn sm:w-[var(--radix-navigation-menu-viewport-width)]" />
			</div>
		</NavigationMenu.Root>
	)
}
