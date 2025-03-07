import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usuarios = sqliteTable('usuarios', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  email: text().notNull(),
  password: text().notNull(),
});
