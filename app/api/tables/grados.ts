import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const grados = sqliteTable('grados', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  codigo: text('codigo').notNull().unique(),
});
