import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { niveles } from './niveles';
import { grados} from './grados';

export const escalaSueldoPersonal = sqliteTable(
  'escala_sueldo_personal', 
    {
      id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
      nivel: integer({ mode: 'number' })
        .notNull(),
      grado: integer({ mode: 'number' })
        .notNull()
        .references(() => grados.id, { onDelete: 'cascade' }),
      tipoPersonal: text('tipo_personal', {
        enum: ['administrativo', 'instructor'],
      }).notNull(),
      escalaSueldo: real('escala_sueldo').notNull(),
    },
    (table) => [
    check(
      'check_type_escala_sueldo_personal',
      sql`${table.tipoPersonal} IN ('administrativo', 'instructor')`,
    ),
  ],
);
