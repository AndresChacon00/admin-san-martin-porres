import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const primasAcademicas = sqliteTable(
  'primas_academicas',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    nivelAcademico: text({
      enum: [
        'TSU',
        'LICENCIADO',
        'POSTGRADO EN ESPECIALIDAD',
        'MAESTRIA',
        'DOCTORADO',
      ],
    }).notNull(),
    porcentaje: real().notNull(),
  },
  (table) => [
    check(
      'check_nivelAcademico',
      sql`${table.nivelAcademico} IN ('TSU', 'LICENCIADO', 'POSTGRADO EN ESPECIALIDAD', 'MAESTRIA', 'DOCTORADO')`,
    ),
  ],
);
