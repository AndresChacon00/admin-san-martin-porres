import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { periodos } from './periodos';
import { cursos } from './cursos';

export const cursosPeriodo = sqliteTable('cursos_periodo', {
  idPeriodo: integer('id_periodo')
    .notNull()
    .references(() => periodos.idPeriodo, { onDelete: 'cascade' }),
  idCurso: integer('id_curso')
    .notNull()
    .references(() => cursos.codigo, { onDelete: 'cascade' }),
  horario: text('horario').notNull(),
});
