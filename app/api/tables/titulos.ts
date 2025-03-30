import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const titulos = sqliteTable('titulos', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  codigo: text('codigo').notNull(),
  nombre: text('nombre').notNull(),
});
