import { periodos } from '~/api/tables/periodos';

export type PeriodoInsert = typeof periodos.$inferInsert;

export type PeriodoUpdate = Partial<PeriodoInsert>;

export type Periodo = typeof periodos.$inferSelect;
