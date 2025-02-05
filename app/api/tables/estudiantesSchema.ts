import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const estudiantes = sqliteTable('estudiantes', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: integer({ mode: 'number' }).notNull(),
  email: text().notNull().unique(),
});
