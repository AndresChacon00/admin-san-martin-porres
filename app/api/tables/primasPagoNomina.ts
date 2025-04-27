import {
  check,
  integer,
  primaryKey,
  real,
  sqliteTable,
} from 'drizzle-orm/sqlite-core';
import { primas } from './primas';
import { pagosNomina } from './pagosNomina';
import { sql } from 'drizzle-orm';

export const primasPagoNomina = sqliteTable(
  'primas_pago_nomina',
  {
    idPrima: integer({ mode: 'number' })
      .notNull()
      .references(() => primas.id, { onDelete: 'restrict' }),
    idPago: integer({ mode: 'number' })
      .notNull()
      .references(() => pagosNomina.id, { onDelete: 'cascade' }),
    monto: real('monto').notNull(),
  },
  (table) => [
    primaryKey({
      name: 'primas_pago_nomina_pk',
      columns: [table.idPago, table.idPrima],
    }),
    check('monto_check_primas_pago', sql`${table.monto} > 0`),
  ],
);
