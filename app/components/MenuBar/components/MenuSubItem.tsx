import * as NavigationMenu from '#node_modules/@radix-ui/react-navigation-menu'
import { Link, useMatch } from '#node_modules/@remix-run/react'
import React from 'react'
import { type MenuItem } from '../types.ts'

export default function MenuSubItem({ title, to }: MenuItem) {
	const isRouteMatch = useMatch(`/${to}`)

	return (
		<NavigationMenu.Item value={title}>
			<NavigationMenu.Trigger className="group">
				<NavigationMenu.Link
					asChild
					className={`relative flex justify-center gap-2.5 px-5 py-2.5 transition-all duration-200 ease-in-out ${
						isRouteMatch ? 'text-slate-900' : ''
					} text-slate-900 hover:dark:bg-secondary`}
					onSelect={e => {
						e.preventDefault()
					}}
				>
					<Link to={to}>
						<div
							className={`font-['DM Sans'] text-xl font-bold leading-relaxed  dark:text-slate-200 ${isRouteMatch ? 'text-slate-900' : 'text-slate-400'}`}
						>
							{title}
						</div>
						<div
							className={`absolute bottom-0 left-0 h-0.5 w-full origin-center transform bg-black transition-transform dark:bg-slate-200 ${isRouteMatch ? 'scale-x-100' : 'scale-x-0'}  `}
						></div>
					</Link>
				</NavigationMenu.Link>
			</NavigationMenu.Trigger>
		</NavigationMenu.Item>
	)
}
