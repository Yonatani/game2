export type MenuItem = {
	title: string
	to: string
	subItem?: Pick<MenuItem, 'title' | 'to'>[]
}
