import { ColumnDef } from '@tanstack/react-table';
import { Periodo } from '~/types/periodos.types';

export const periodosColumns: ColumnDef<Periodo>[] = [
  {
    accessorKey: 'idPeriodo',
    header: 'ID Periodo',
  },
  {
    accessorKey: 'fechaInicio',
    header: 'Fecha de Inicio',
    accessorFn: (row) => {
      return new Date(row.fechaInicio).toLocaleDateString();
    },
  },
  {
    accessorKey: 'fechaFin',
    header: 'Fecha de Fin',
    accessorFn: (row) => {
      return new Date(row.fechaFin).toLocaleDateString();
    },
  },
];
