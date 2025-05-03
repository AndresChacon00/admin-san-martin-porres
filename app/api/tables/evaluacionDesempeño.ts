import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { empleados } from './empleados';
import { usuarios } from './usuarios';
import { sql } from 'drizzle-orm';
import { periodosEvaluacionDesempeño } from './periodosEvaluacionDesempeño';

export const evaluacionesDesempeño = sqliteTable('evaluaciones_desempeno', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  empleadoId: integer({ mode: 'number' })
    .notNull()
    .references(() => empleados.id, { onDelete: 'restrict' }),
  periodoId: integer({ mode: 'number' })
    .notNull()
    .references(() => periodosEvaluacionDesempeño.id, { onDelete: 'cascade' }),
  registradoPorId: integer({ mode: 'number' })
    .notNull()
    .references(() => usuarios.id, { onDelete: 'restrict' }),
  fecha: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  cargoEmpleado: text('cargo_empleado').notNull(),
  sueldoMensual: real('sueldo_mensual').notNull(),
  otrasPrimas: real('otras_primas').notNull(),
  totalAsignacionesDiarias: real('total_asignaciones_diarias').notNull(),
  factorCalculo: real('factor_calculo').notNull().default(4.01926),
  diasRangoObtenido: real('dias_rango_obtenido').notNull(),
  montoFinal: real('monto_final').notNull(),
});
