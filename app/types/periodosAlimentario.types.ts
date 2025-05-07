import { periodosAlimentario } from '~/api/tables/periodosAlimentario';

export type PeriodosAlimentarioSelect = typeof periodosAlimentario.$inferSelect;
export type PeriodosAlimentarioInsert = typeof periodosAlimentario.$inferInsert;
