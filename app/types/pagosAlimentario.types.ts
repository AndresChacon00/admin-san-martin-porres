import { pagosAlimentario } from '~/api/tables/pagosAlimentario';

export type PagoAlimentarioSelect = typeof pagosAlimentario.$inferSelect;
export type PagoAlimentarioInsert = typeof pagosAlimentario.$inferInsert;
export type PagoAlimentarioListItem = {
  id: number;
  periodoAlimentario: string;
  fecha: string;
  nombreEmpleado: string;
  totalARecibir: number;
  nombreUsuario: string;
};
export type PagoAlimentarioExportar = {
  periodoAlimentario: string;
  fecha: Date;
  nombreEmpleado: string;
  cedulaEmpleado: string;
  cargoEmpleado: string;
  horasSemanales: number;
  totalBeneficio: number;
  descuentoInasistencia: number;
  totalARecibir: number;
  nombreCreador: string;
};
