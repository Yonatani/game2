const AIAssetsSubPages = [
	{ title: 'Notebooks', to: 'ai-assets/notebooks' },
	{ title: 'Models', to: 'ai-assets/models' },
	{ title: 'Datasets', to: 'ai-assets/datasets' },
	{ title: 'Software Dependencies', to: 'ai-assets/software-dependencies' },
]

export const pages = [
	{ title: 'Dashboard', to: '' },
	{
		title: 'Try',
		to: 'try',
	},
	{
		title: 'AI Assets',
		to: 'ai-assets',
		subItems: AIAssetsSubPages,
	},
	{ title: 'Risks', to: 'risks' },
	{ title: 'Policies', to: 'policies' },
	{ title: 'Compliance', to: 'compliance' },
	{ title: 'Reports', to: 'reports' },
]
