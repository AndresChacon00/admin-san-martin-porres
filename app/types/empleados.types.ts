import { z } from 'zod';
import { empleados } from '~/api/tables/empleados';
import { datosCargoEmpleado } from '~/lib/validators';

export type Sexo = 'F' | 'M';

export type EstadoCivil = 'S' | 'C' | 'D' | 'V' | 'R';

export type EmpleadoInsert = typeof empleados.$inferInsert;

export type EmpleadoUpdate = Partial<EmpleadoInsert>;

export type Empleado = typeof empleados.$inferSelect;

export type EmpleadoPersonalData = {
  cedula: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  sexo: 'F' | 'M';
  estadoCivil: 'S' | 'C' | 'D' | 'V' | 'R';
  religion: string;
  cantidadHijos: number;
  hijosMenoresSeis: number;
};

export type EmpleadoProfessionalData = {
  fechaIngresoAvec: string;
  fechaIngresoPlantel: string;
  titulo: string;
  descripcionTitulo: string;
  mencionTitulo: string;
  carreraEstudiando: string;
  tipoLapsoEstudios: string;
  numeroLapsosAprobados: number;
  postgrado: string;
  experienciaLaboral: number;
};

export interface EmpleadoPositionData extends z.infer<typeof datosCargoEmpleado> {}
