import { sqliteTable, real, text } from 'drizzle-orm/sqlite-core';

export const sueldos_y_salarios = sqliteTable('sueldos_y_salarios', {
  clave: text('clave').primaryKey(), // Ej: 'sueldo_minimo', 'salario_integral'
  valor: real('valor').notNull(),
});
