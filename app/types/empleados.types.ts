import { z } from 'zod';
import { empleados } from '~/api/tables/empleados';
import {
  datosCargoEmpleado,
  datosPersonalesEmpleado,
  datosProfesionalesEmpleado,
} from '~/lib/validators';

export type Sexo = 'F' | 'M';

export type EstadoCivil = 'S' | 'C' | 'D' | 'V' | 'R';

export type EmpleadoInsert = typeof empleados.$inferInsert;

export type EmpleadoUpdate = Partial<EmpleadoInsert>;

export type Empleado = typeof empleados.$inferSelect;

export type EmpleadoExport = Empleado & {
  nombreCargo: string;
  codigoTitulo: string;
  codigoCargo: string;
  codigoNivelSistema: string;
  codigoNivelCentro: string;
  codigoGradoSistema: string;
  codigoGradoCentro: string;
};

export type NivelAcademico =
  | 'POSTGRADO EN ESPECIALIDAD'
  | 'MAESTRIA'
  | 'DOCTORADO'
  | null;

export type EmpleadoForNomina = {
  id: number;
  cedula: string;
  nombre: string;
  sueldo: number;
  fechaIngresoAvec: Date;
  titulo: string;
  nivelAcademico: NivelAcademico;
  hijos: number;
};

export interface EmpleadoPersonalData
  extends z.infer<typeof datosPersonalesEmpleado> {}

export interface EmpleadoProfessionalData
  extends z.infer<typeof datosProfesionalesEmpleado> {}

export interface EmpleadoPositionData
  extends z.infer<typeof datosCargoEmpleado> {}
