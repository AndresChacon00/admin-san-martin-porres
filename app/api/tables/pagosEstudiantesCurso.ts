import {
  sqliteTable,
  integer,
  text,
  real,
  foreignKey,
} from 'drizzle-orm/sqlite-core';
import { estudiantesCursoPeriodo } from './estudiantesCursoPeriodo';

export const pagosEstudiantesCurso = sqliteTable('pagos_estudiantes_curso', {
  idPago: integer('id_pago').primaryKey({ autoIncrement: true }),
  idPeriodo: text('id_periodo')
    .notNull()
    .references(() => estudiantesCursoPeriodo.idPeriodo),
  codigoCurso: text('codigo_curso')
    .notNull()
    .references(() => estudiantesCursoPeriodo.codigoCurso),
  cedulaEstudiante: text('id_estudiante')
    .notNull()
    .references(() => estudiantesCursoPeriodo.cedulaEstudiante),
  monto: real('monto').notNull(), // Monto del pago
  fecha: integer({ mode: 'timestamp' }).notNull(), // Fecha del pago
  tipoPago: text('tipo_pago').notNull(), // Tipo de pago (efectivo, transferencia, etc.)
  comprobante: text('comprobante'), // Detalles del comprobante
});
