import { sql } from 'drizzle-orm';
import {
  check,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const primas = sqliteTable(
  'primas',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    nombre: text().notNull(),
    tipoFactor: text({
      enum: ['porcentaje', 'dias', 'factor', 'constante'],
    }).notNull(),
    factor: real().notNull(),
    campoBase: text({
      enum: ['Salario Base', 'Salario Integral', 'Sueldo Base Mínimo', 'Hijos'],
    }),
    frecuencia: text({ enum: ['mensual', 'anual'] }).notNull(),
  },
  (table) => [
    check(
      'check_tipoFactor',
      sql`${table.tipoFactor} IN ('porcentaje', 'dias', 'factor', 'constante') OR ${table.tipoFactor} IS NULL`,
    ),
    check(
      'check_campoBase',
      sql`${table.campoBase} IN ('Salario Base', 'Salario Integral', 'Sueldo Base Mínimo', 'Hijos')`,
    ),
    check('check_frecuencia', sql`${table.frecuencia} IN ('mensual', 'anual')`),
  ],
);
