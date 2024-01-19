import { json } from '@remix-run/node'
import { requireUserId } from './auth.server.ts'
import { prisma } from './db.server.ts'
import { type useUser } from './user.ts'
import {Role, type User, UserRole} from "@prisma/client";

export async function requireUserWithPermission(
	request: Request,
	permission: PermissionString,
) {
	const userId = await requireUserId(request)
	const permissionData = parsePermissionString(permission)
	const user = await prisma.user.findFirst({
		select: { id: true },
		where: {
			id: userId,
			roles: {
				some: {
					permissions: {
						some: {
							permission: {
								...permissionData,
								access: permissionData.access
									? { in: permissionData.access }
									: undefined,
							},

						},
					},
				},
			},
		},
	});
	if (!user) {
		throw json(
			{
				error: 'Unauthorized',
				requiredPermission: permissionData,
				message: `Unauthorized: required permissions: ${permission}`,
			},
			{ status: 403 },
		)
	}
	return user.id
}

export async function requireUserWithRole(request: Request, name: string) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findFirst({
		select: { id: true },
		where: { id: userId, roles: { some: {role: { name}} } },
	})
	if (!user) {
		throw json(
			{
				error: 'Unauthorized',
				requiredRole: name,
				message: `Unauthorized: required role: ${name}`,
			},
			{ status: 403 },
		)
	}
	return user.id
}

type Action = 'create' | 'read' | 'update' | 'delete'
type Entity = 'user' | 'note'
type Access = 'own' | 'any' | 'own,any' | 'any,own'
type PermissionString = `${Action}:${Entity}` | `${Action}:${Entity}:${Access}`
function parsePermissionString(permissionString: PermissionString) {
	const [action, entity, access] = permissionString.split(':') as [
		Action,
		Entity,
		Access | undefined,
	]
	return {
		action,
		entity,
		access: access ? (access.split(',') as Array<Access>) : undefined,
	}
}

// TODO fix all types
export function userHasPermission(
	user: any,
	permission: PermissionString,
) {
	if (!user) return false
	const { action, entity, access } = parsePermissionString(permission)
	return user.roles?.some((role: Record<string, any>) =>
		role.permissionsToUserRole.some(
			(permissionToUserRole: any) =>
				permissionToUserRole.permission.entity === entity &&
				permissionToUserRole.permission.action === action &&
				(!access || access.includes(permissionToUserRole.permission.access)),
		),
	)
}

// export function userHasRole(
// 	user: Pick<ReturnType<typeof useUser>, 'roles'> | null,
// 	role: string,
// ) {
// 	if (!user) return false
// 	return user.roles.some(r => r.name === role)
// }
