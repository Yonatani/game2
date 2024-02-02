import * as NavigationMenu from '#node_modules/@radix-ui/react-navigation-menu'
import { Link, useMatch } from '#node_modules/@remix-run/react'
import React from 'react'
import MenuSubItem from '#app/components/MenuBar/components/MenuSubItem.tsx'
import { type MenuItem as MenuItemType } from '../types.ts'

export default function MenuItem({
	title,
	to,
	subItems,
}: {
	title: string
	to: string
	subItems?: MenuItemType[]
}) {
	const isRouteMatch = useMatch(`/${to}/*`)

	return (
		<NavigationMenu.Item value={title}>
			<NavigationMenu.Trigger className="group">
				<NavigationMenu.Link
					asChild
					className={`flex items-center justify-center gap-2.5 rounded-lg px-5 py-2.5 transition-colors transition-shadow ${
						isRouteMatch ? 'text-slate-900 shadow-lg dark:bg-secondary' : ''
					} hover:shadow-lg hover:dark:bg-secondary`}
				>
					<Link to={to}>
						<div
							className={`font-['DM Sans'] text-xl font-bold leading-relaxed  dark:text-slate-200 ${isRouteMatch ? 'text-slate-900' : 'text-slate-400'}`}
						>
							{title}
						</div>
					</Link>
				</NavigationMenu.Link>
			</NavigationMenu.Trigger>
			{subItems && (
				<NavigationMenu.Content className=" data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute left-0 top-0 w-full sm:w-auto">
					<NavigationMenu.Sub defaultValue={subItems[0].title} className="">
						<NavigationMenu.List className="shadow-top-bar flex w-screen items-center justify-center gap-3">
							{subItems.map(({ title: subTitle, to: subTo }) => {
								return <MenuSubItem title={subTitle} to={subTo} />
							})}
						</NavigationMenu.List>
					</NavigationMenu.Sub>
				</NavigationMenu.Content>
			)}
		</NavigationMenu.Item>
	)
}
