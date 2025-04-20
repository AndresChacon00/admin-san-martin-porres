import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';
import { periodos } from './periodos';
import { cursos } from './cursos';
import { estudiantes } from './estudiantes';

export const estudiantesCursoPeriodo = sqliteTable(
  'estudiantes_curso_periodo',
  {
    idPeriodo: integer('id_periodo')
      .notNull()
      .references(() => periodos.idPeriodo),
    codigoCurso: text('codigo_curso')
      .notNull()
      .references(() => cursos.codigo),
    idEstudiante: integer('id_estudiante')
      .notNull()
      .references(() => estudiantes.cedula),

    // ✅ Prevent duplicate enrollments (Unique Constraint)
  },
  (table) => ({
    uniqueEnrollment: unique().on(
      table.idPeriodo,
      table.codigoCurso,
      table.idEstudiante,
    ),
  }),
);
