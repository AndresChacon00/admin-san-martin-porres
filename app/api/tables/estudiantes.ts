import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const estudiantes = sqliteTable('estudiantes', {
  cedula: text().notNull().primaryKey(),
  nombre: text().notNull(),
  apellido: text().notNull(),
  sexo: text().notNull(),
  fechaNacimiento: integer({ mode: 'timestamp_ms' }),
  edad: integer({ mode: 'number' }).notNull(),
  religion: text().notNull(),
  telefono: text().notNull(),
  correo: text().notNull().unique(),
  direccion: text().notNull(),
  ultimoAñoCursado: text().notNull(),
});
