import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const periodosNomina = sqliteTable('periodos_nomina', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull().unique(),
});
