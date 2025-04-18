import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { estudiantesCursoPeriodo } from './estudiantesCursoPeriodo';

export const pagosEstudiantesCurso = sqliteTable('pagos_estudiantes_curso', {
  idPago: integer('id_pago').primaryKey({ autoIncrement: true }),
  idPeriodo: integer('id_periodo')
    .notNull()
    .references(() => estudiantesCursoPeriodo.idPeriodo),
  codigoCurso: text('codigo_curso')
    .notNull()
    .references(() => estudiantesCursoPeriodo.codigoCurso),
  idEstudiante: integer('id_estudiante')
    .notNull()
    .references(() => estudiantesCursoPeriodo.idEstudiante),
  monto: real('monto').notNull(), // Monto del pago
  fecha: integer({ mode: 'timestamp' }).notNull(), // Fecha del pago
  tipoPago: text('tipo_pago').notNull(), // Tipo de pago (efectivo, transferencia, etc.)
  comprobante: text('comprobante'), // Detalles del comprobante
});
