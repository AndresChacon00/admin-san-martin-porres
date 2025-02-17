import { empleados } from '~/api/tables/empleados';

export type Sexo = 'F' | 'M';

export type EstadoCivil = 'S' | 'C' | 'D' | 'V' | 'R';

export type EmpleadoInsert = typeof empleados.$inferInsert;

export type EmpleadoUpdate = Partial<EmpleadoInsert>;

export type Empleado = typeof empleados.$inferSelect;
