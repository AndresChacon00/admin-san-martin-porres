import { z } from 'zod';

// #region Empleados
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
  titulo: z.coerce.number().int().min(1, 'Título requerido'),
  descripcionTitulo: z.string().optional().default(''),
  mencionTitulo: z.string().optional().default(''),
  carreraEstudiando: z.string().optional().default(''),
  tipoLapsoEstudios: z.string().optional().default(''),
  numeroLapsosAprobados: z.coerce.number().int().default(0),
  postgrado: z.string().optional().default(''),
  experienciaLaboral: z.coerce
    .number()
    .int()
    .min(0, 'Número inválido')
    .default(0),
});

export const datosCargoEmpleado = z.object({
  gradoSistema: z.coerce.number({
    required_error: 'Grado en el sistema requerido',
  }),
  nivelSistema: z.coerce.number({
    required_error: 'Nivel en el sistema requerido',
  }),
  gradoCentro: z.coerce.number({
    required_error: 'Grado en el centro requerido',
  }),
  nivelCentro: z.coerce.number({
    required_error: 'Nivel en el centro requerido',
  }),
  cargo: z.coerce.number({ required_error: 'Cargo requerido' }),
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

// #endregion

// #region Auth
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El correo es requerido' })
    .email('Correo inválido'),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(6, 'Contraseña muy corta'),
});

export const newUserSchema = loginSchema.extend({
  nombre: z.string({ required_error: 'El nombre es requerido' }),
  role: z.enum(['admin', 'secretaria'], { required_error: 'Rol requerido' }),
  adminPassword: z.string({
    required_error: 'La clave de administrador es requerida',
  }),
});

export const resetPasswordSchema = loginSchema.extend({
  adminPassword: z.string({
    required_error: 'La clave de administrador es requerida',
  }),
});
// #endregion

// #region Equivalencias
export const equivalenciasNivelesSchema = z.object({
  minTiempoServicio: z.coerce
    .number()
    .int()
    .min(0, 'Tiempo de servicio inválido'),
  formacionCrecimientoPersonal: z.string().optional().default('NO REQUIERE'),
});
// #endregion
