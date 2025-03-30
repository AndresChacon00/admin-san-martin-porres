import type { UserRole } from './types/usuarios.types';

export const ROLE_TRANSLATIONS: Record<UserRole, string> = {
  admin: 'Administrador General',
  secretaria: 'Secretaria',
};
