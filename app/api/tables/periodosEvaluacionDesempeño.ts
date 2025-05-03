import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const periodosEvaluacionDesempeño = sqliteTable(
  'periodos_evaluacion_desempeno',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    nombre: text('nombre').notNull().unique(),
  },
);
