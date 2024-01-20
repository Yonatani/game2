import { type User as PrismaUser } from '@prisma/client'
import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'

import { Link, useLoaderData } from '@remix-run/react'
import { Icon } from '../../components/ui/icon.js'
import { getHints } from '../../utils/client-hints.js'
import { prisma } from '../../utils/db.server.ts'
import { getEnv } from '../../utils/env.server.js'
import {
	combineHeaders,
	getDomainUrl,
	getUserImgSrc,
} from '../../utils/misc.js'
import { getTheme } from '../../utils/theme.server.js'
import { makeTimings } from '../../utils/timing.server.ts'
import { getToast } from '../../utils/toast.server.js'

type TransformedGameRoles = Record<string, any>

type LoaderUser = Pick<
	PrismaUser,
	'id' | 'name' | 'username' | 'email' | 'popularity'
> & {
	image?: {
		id: string
	} | null // Allow it to be null
	gameRoles: TransformedGameRoles
}
export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

const convertGameRolesToObject = (
	gameRoles: { type: string; power: number }[],
): TransformedGameRoles => {
	const transformed: TransformedGameRoles = {}
	for (const gameRole of gameRoles) {
		const { type, ...rest } = gameRole
		transformed[type] = rest
	}
	return transformed
}

export async function loader({ request }: LoaderFunctionArgs) {
	const timings = makeTimings('root loader')

	const usersData = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			username: true,
			image: {
				select: {
					id: true,
				},
			},
			email: true,
			popularity: true,
			gameRoles: {
				select: {
					id: true,
					userId: true,
					type: true,
					power: true,
				},
			},
		},
	})

	const { toast, headers: toastHeaders } = await getToast(request)

	const users: LoaderUser[] = usersData.map(user => ({
		...user,
		gameRoles: convertGameRolesToObject(user.gameRoles),
	}))

	return json(
		{
			users,
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: {
					theme: getTheme(request),
				},
			},
			ENV: getEnv(),
			toast,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
			),
		},
	)
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	console.log('data11', data)
	const getRoleIcon = (role: string) => {
		switch (role) {
			case 'artist':
				return 'magic-wand'
			case 'critic':
				return 'eye-open'
			default:
				return 'question-mark' // default icon
		}
	}

	return (
		<div className="mx-auto mt-8 max-w-4xl px-4">
			{' '}
			{/* Added container */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{data.users.map((user: LoaderUser) => (
					<div key={user.id} className="rounded border p-4 shadow">
						{/* Display user image */}
						{user.image && (
							<img
								src={getUserImgSrc(user.image?.id)}
								alt={`portrait of ${user.name || user.username}`}
								className="mb-4 h-24 w-24 rounded-full"
							/>
						)}
						<h2 className="text-xl font-bold">{user.name || user.username}</h2>
						<p>{user.email}</p>
						{/* Display game roles and powers */}
						<div className="mt-4">
							<h3 className="text-lg font-semibold">Game Roles:</h3>
							<ul className="flex flex-wrap">
								{Object.entries(user.gameRoles).map(([role, details]) => (
									<li key={role} className="mr-4 flex items-center">
										<Icon name={getRoleIcon(role)} className="mr-2" />
										{role}: Power {details.power}
									</li>
								))}
							</ul>
						</div>
						<Link
							to={`/users/${user.id}`}
							className="mt-4 text-blue-500 hover:underline"
						>
							View Profile
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}
