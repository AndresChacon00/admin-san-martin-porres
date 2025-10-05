import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const periodos = sqliteTable('periodo', {
  idPeriodo: text('id_periodo').primaryKey(),
  fechaInicio: integer({ mode: 'timestamp' }).notNull(),
  fechaFin: integer({ mode: 'timestamp' }).notNull(),
});
