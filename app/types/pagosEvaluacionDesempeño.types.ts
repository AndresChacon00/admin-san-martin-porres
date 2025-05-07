import { evaluacionesDesempeño } from '~/api/tables/evaluacionDesempeño';

export type PagosEvaluacionDesempeñoSelect =
  typeof evaluacionesDesempeño.$inferSelect;
export type PagosEvaluacionDesempeñoInsert =
  typeof evaluacionesDesempeño.$inferInsert;
export type EvaluacionDesempeñoListItem = {
  id: number;
  periodo: string;
  fecha: string;
  nombreEmpleado: string;
  montoFinal: number;
  nombreUsuario: string;
};
export type EvaluacionDesempeñoExportar = {
  periodo: string;
  fecha: Date;
  nombreEmpleado: string;
  cedulaEmpleado: string;
  cargoEmpleado: string;
  sueldoMensual: number;
  otrasPrimas: number;
  totalAsignacionesDiarias: number;
  factorCalculo: number;
  diasRangoObtenido: number;
  montoFinal: number;
  nombreCreador: string;
};
