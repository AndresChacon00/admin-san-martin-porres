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
type ItemPagoNominaExportar = {
  nombre: string;
  monto: number;
};
export type PagoNominaExportar = {
  fecha: Date;
  nombreEmpleado: string;
  cedulaEmpleado: string;
  cargoEmpleado: string;
  fechaIngreso: Date;
  sueldoBase: number;
  nombrePeriodo: string;
  asignaciones: ItemPagoNominaExportar[];
  totalAsignaciones: number;
  adicionales: ItemPagoNominaExportar[];
  totalAdicionales: number;
  deducciones: ItemPagoNominaExportar[];
  totalDeducciones: number;
  totalNomina: number;
  nombreCreador: string;
};
