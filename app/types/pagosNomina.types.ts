import { pagosNomina } from '~/api/tables/pagosNomina';

export type PagoSelect = typeof pagosNomina.$inferSelect;
export type PagoInsert = typeof pagosNomina.$inferInsert;
export type PagoListItem = {
  id: number;
  periodoNomina: string;
  fecha: string;
  nombreEmpleado: string;
  totalNomina: number;
  nombreUsuario: string;
};
