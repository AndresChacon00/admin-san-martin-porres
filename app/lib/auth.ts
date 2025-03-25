import { getSession } from '~/sessions';
import { UserRole } from '~/types/usuarios.types';

/**
 * Verifica si el usuario pertenece al rol o roles especificados
 * @author gabrielm
 * @param request
 * @param role Por defecto permite todos los roles
 */
export async function isRole(
  request: Request,
  role: UserRole | UserRole[] = ['admin', 'secretaria'],
) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('role')) {
    const roleList = Array.isArray(role) ? role : [role];
    const sessionRole = session.get('role');

    if (!sessionRole) return false;

    return roleList.includes(sessionRole);
  }
  return false;
}
