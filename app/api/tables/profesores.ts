import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { empleados } from './empleados'; // Asegúrate de que la ruta es correcta

export const profesores = sqliteTable('profesores', {
  id: integer({ mode: 'number' }).primaryKey().references(() => empleados.id)
});