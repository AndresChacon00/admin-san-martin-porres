import { integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';

export const primasAntiguedad = sqliteTable('primas_antiguedad', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  tiempoServicio: integer({ mode: 'number' }).notNull(),
  porcentaje: real().notNull(),
});
