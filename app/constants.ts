import type { UserRole } from './types/usuarios.types';

export const ROLE_TRANSLATIONS: Record<UserRole, string> = {
  admin: 'Administrador General',
  secretaria: 'Secretaria',
};

export const FOUNDATION_NAME = 'FUNDACECASMAR';
export const RIF = 'J297107436';
export const ADDRESS = 'BRISAS DEL SUR, CALLE MANUEL FELIPE PARRA, CASA #36';
export const CENTRO_ID = '11C058';
export const EXCEL_COLS = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
} as const;
