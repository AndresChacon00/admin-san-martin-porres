import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const periodosAlimentario = sqliteTable('periodos_alimentario', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull().unique(),
});
