import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const periodos = sqliteTable('periodo', {
  idPeriodo: integer('id_periodo').primaryKey(),
  fechaInicio: integer({ mode: 'timestamp' }).notNull(),
  fechaFin: integer({ mode: 'timestamp' }).notNull(),
});
