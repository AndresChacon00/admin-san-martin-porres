import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { grados } from './grados';
import { titulos } from './titulos';

export const equivGrados = sqliteTable(
  'equivalencia_grados',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    grado: integer({ mode: 'number' })
      .notNull()
      .references(() => grados.id, { onDelete: 'cascade' }),
    titulo: integer({ mode: 'number' })
      .notNull()
      .references(() => titulos.id, { onDelete: 'cascade' }),
    experienciaLaboral: integer('experiencia_laboral').notNull().default(0),
    formacionTecnicoProfesional: text(
      'formacion_tecnico_profesional',
    ).notNull(),
    tipoPersonal: text('tipo_personal', {
      enum: ['administrativo', 'instructor'],
    }).notNull(),
  },
  (table) => [
    check(
      'check_type_equiv_grados',
      sql`${table.tipoPersonal} IN ('administrativo', 'instructor')`,
    ),
  ],
);
