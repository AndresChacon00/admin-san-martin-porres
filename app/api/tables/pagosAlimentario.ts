import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { empleados } from './empleados';
import { usuarios } from './usuarios';
import { sql } from 'drizzle-orm';
import { periodosAlimentario } from './periodosAlimentario';

export const pagosAlimentario = sqliteTable('pagos_alimentario', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  empleadoId: integer({ mode: 'number' })
    .notNull()
    .references(() => empleados.id, { onDelete: 'restrict' }),
  periodoAlimentarioId: integer({ mode: 'number' })
    .notNull()
    .references(() => periodosAlimentario.id, { onDelete: 'cascade' }),
  registradoPorId: integer({ mode: 'number' })
    .notNull()
    .references(() => usuarios.id, { onDelete: 'restrict' }),
  fecha: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  cargoEmpleado: text('cargo_empleado').notNull(),
  horasSemanales: real('horas_semanales').notNull(),
  totalBeneficio: real('total_beneficio').notNull(),
  descuentoInasistencia: real('descuento_inasistencia').notNull(),
  totalARecibir: real('total_a_recibir').notNull(),
});
