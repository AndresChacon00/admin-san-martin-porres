import { pagos } from '~/api/tables/pagos';

export type PagoSelect = typeof pagos.$inferSelect;
export type PagoInsert = typeof pagos.$inferInsert;
