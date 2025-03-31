import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { cargos } from './cargos';
import { niveles } from './niveles';
import { sql } from 'drizzle-orm';

export const equivCargos = sqliteTable(
  'equivalencia_cargos',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    cargo: integer('cargo', { mode: 'number' })
      .notNull()
      .references(() => cargos.id, { onDelete: 'cascade' }),
    nivel: integer('nivel', { mode: 'number' })
      .notNull()
      .references(() => niveles.id, {
        onDelete: 'cascade',
      }),
    tipoPersonal: text('tipo_personal', {
      enum: ['administrativo', 'instructor'],
    }).notNull(),
  },
  (table) => [
    check(
      'check_type_equiv_cargos',
      sql`${table.tipoPersonal} IN ('administrativo', 'instructor')`,
    ),
  ],
);
