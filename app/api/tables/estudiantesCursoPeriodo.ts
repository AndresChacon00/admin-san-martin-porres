import { sqliteTable, text, primaryKey, real } from 'drizzle-orm/sqlite-core';
import { periodos } from './periodos';
import { cursos } from './cursos';
import { estudiantes } from './estudiantes';

export const estudiantesCursoPeriodo = sqliteTable(
  'estudiantes_curso_periodo',
  {
    idPeriodo: text('id_periodo')
      .notNull()
      .references(() => periodos.idPeriodo),
    codigoCurso: text('codigo_curso')
      .notNull()
      .references(() => cursos.codigo),
    cedulaEstudiante: text('id_estudiante')
      .notNull()
      .references(() => estudiantes.cedula),

    // Atributos para la nota final del estudiante (cualitativa y cuantitativa)
    notaCuantitativa: real('notaCuantitativa'),
    notaCualitativa: text('nota_cualitativa'),

    // ✅ Prevent duplicate enrollments (Unique Constraint)
  },
  (table) => ({
    primaryKey: primaryKey(
      table.idPeriodo,
      table.codigoCurso,
      table.cedulaEstudiante,
    ),
  }),
);
