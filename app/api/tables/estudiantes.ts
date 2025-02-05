import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const estudiantes = sqliteTable('estudiantes', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  apellido: text().notNull(),
  cedula: text().notNull().unique(),
  sexo: text().notNull(),
  fechaNacimiento: integer({ mode: 'timestamp_ms' }),
  edad: integer({ mode: 'number' }).notNull(),
  religion: text().notNull(),
  telefono: text().notNull(),
  correo: text().notNull().unique(),
  direccion: text().notNull(),
  ultimoAñoCursado: text().notNull(),
});
