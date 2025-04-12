import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { niveles } from './niveles';

export const equivNiveles = sqliteTable('equivalencia_niveles', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  nivel: integer({ mode: 'number' })
    .notNull()
    .references(() => niveles.id, { onDelete: 'cascade' }),
  minTiempoServicio: integer('min_tiempo_servicio', {
    mode: 'number',
  }).notNull(),
  formacionCrecimientoPersonal: text(
    'formacion_crecimiento_personal',
  ).notNull(),
});
