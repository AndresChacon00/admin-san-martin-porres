import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const cargos = sqliteTable('cargos', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  codigo: text('codigo').notNull(), // ej: CG
  nivelCargo: text('nivel_cargo').notNull(), // ej: IV, V, VI, VII
  nombreCargo: text('nombre_cargo').notNull(), // ej: Coordinador General
});
