import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const cursos = sqliteTable('cursos', {
  codigo: text('codigo').primaryKey(),
  nombreCurso: text('nombre_curso').notNull(),
  descripcion: text('descripcion'),
  estado: integer('estado').default(1), // 1 for active, 0 for inactive
  precioTotal: real('precio_total'),
  templateLayout: text('template_layout'),
});
