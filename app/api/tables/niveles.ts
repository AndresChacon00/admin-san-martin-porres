import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const niveles = sqliteTable('niveles', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull().unique(),
});
