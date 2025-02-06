import { empleados } from '~/api/tables/empleados';

export type EmpleadoInsert = typeof empleados.$inferInsert;
