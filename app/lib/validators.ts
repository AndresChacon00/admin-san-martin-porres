import { z } from 'zod';

export const datosPersonalesEmpleado = z.object({
  cedula: z
    .string({ required_error: 'Cédula requerida' })
    .min(8, 'Cédula muy corta')
    .regex(/^[VE]/, 'Cédula debe comenzar con V o E'),
  nombreCompleto: z
    .string({ required_error: 'Nombre requerido' })
    .min(3, 'Nombre muy corto'),
  fechaNacimiento: z
    .string({ required_error: 'Fecha de nacimiento requerida' })
    .date('Fecha de nacimiento inválida'),
  sexo: z.enum(['F', 'M'], { required_error: 'Sexo requerido' }),
  estadoCivil: z.enum(['S', 'C', 'D', 'V', 'R'], {
    required_error: 'Estado civil requerido',
  }),
  religion: z.string().min(3, 'Religión muy corta'),
  cantidadHijos: z.coerce.number().int().min(0, 'Cantidad de hijos inválida'),
  hijosMenoresSeis: z.coerce
    .number({
      required_error: 'Cantidad de hijos menores de seis años es requerida',
    })
    .int()
    .min(0, 'Número inválido'),
});

export const datosProfesionalesEmpleado = z.object({
  fechaIngresoAvec: z
    .string({
      required_error: 'Fecha de ingreso al AVEC es requerida',
    })
    .date('Fecha inválida'),
  fechaIngresoPlantel: z
    .string({
      required_error: 'Fecha de ingreso al plantel es requerida',
    })
    .date('Fecha inválida'),
  titulo: z.string().optional().default(''),
  descripcionTitulo: z.string().optional().default(''),
  mencionTitulo: z.string().optional().default(''),
  carreraEstudiando: z.string().optional().default(''),
  tipoLapsoEstudios: z.string().optional().default(''),
  numeroLapsosAprobados: z.number().int().optional().default(0),
  postgrado: z.string().optional().default(''),
  experienciaLaboral: z.coerce
    .number()
    .int()
    .min(0, 'Número inválido')
    .optional()
    .default(0),
});

export const datosCargoEmpleado = z.object({
  gradoSistema: z.string({ required_error: 'Grado en el sistema requerido' }),
  nivelSistema: z.string({ required_error: 'Nivel en el sistema requerido' }),
  gradoCentro: z.string({ required_error: 'Grado en el centro requerido' }),
  nivelCentro: z.string({ required_error: 'Nivel en el centro requerido' }),
  cargo: z.string({ required_error: 'Cargo requerido' }),
  horasSemanales: z.coerce.number().int().min(0, 'Horas semanales inválidas'),
  sueldo: z.coerce.number().min(0, 'Sueldo inválido'),
  asignacionesMensual: z.coerce
    .number()
    .min(0, 'Asignaciones mensuales inválidas'),
  deduccionesMensual: z.coerce
    .number()
    .min(0, 'Deducciones mensuales inválidas'),
  primaAntiguedad: z.coerce.number().min(0, 'Prima de antigüedad inválida'),
  primaGeografica: z.coerce.number().min(0, 'Prima geográfica inválida'),
  primaCompensacionAcademica: z.coerce
    .number()
    .min(0, 'Prima de compensación académica inválida'),
  primaAsistencial: z.coerce.number().min(0, 'Prima asistencial inválida'),
  contribucionDiscapacidad: z.coerce
    .number()
    .min(0, 'Contribución por discapacidad inválida'),
  contribucionDiscapacidadHijos: z.coerce
    .number()
    .min(0, 'Contribución por discapacidad de hijos inválida'),
  porcentajeSso: z.coerce.number().min(0, 'Porcentaje SSO inválido'),
  porcentajeRpe: z.coerce.number().min(0, 'Porcentaje RPE inválido'),
  porcentajeFaov: z.coerce.number().min(0, 'Porcentaje FAOV inválido'),
  pagoDirecto: z.boolean().default(false),
  jubilado: z.boolean().default(false),
  cuentaBancaria: z.string().optional().default(''),
  observaciones: z.string().optional().default(''),
});
