import {
  sqliteTable,
  integer,
  text,
  real,
  foreignKey,
} from 'drizzle-orm/sqlite-core';
import { estudiantesCursoPeriodo } from './estudiantesCursoPeriodo';

export const pagosEstudiantesCurso = sqliteTable(
  'pagos_estudiantes_curso',
  {
    idPago: integer('id_pago').primaryKey({ autoIncrement: true }),
    idPeriodo: text('id_periodo').notNull(),
    codigoCurso: text('codigo_curso').notNull(),
    cedulaEstudiante: text('id_estudiante').notNull(),
    monto: real('monto').notNull(), // Monto del pago
    fecha: integer({ mode: 'timestamp' }).notNull(), // Fecha del pago
    tipoPago: text('tipo_pago').notNull(), // Tipo de pago (efectivo, transferencia, etc.)
    comprobante: text('comprobante'), // Detalles del comprobante
  },
  (table) => [
    foreignKey({
      columns: [table.idPeriodo, table.codigoCurso, table.cedulaEstudiante],
      foreignColumns: [
        estudiantesCursoPeriodo.idPeriodo,
        estudiantesCursoPeriodo.codigoCurso,
        estudiantesCursoPeriodo.cedulaEstudiante,
      ],
      name: 'fk_estudiantes_curso_periodo',
    }),
  ],
);
