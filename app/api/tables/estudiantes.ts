import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const estudiantes = sqliteTable('estudiantes', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  apellido: text().notNull(),
  cedula: text().notNull().unique(),
  sexo: text().notNull(),
  fecha: 
  age: integer({ mode: 'number' }).notNull(),
  email: text().notNull().unique(),
});
