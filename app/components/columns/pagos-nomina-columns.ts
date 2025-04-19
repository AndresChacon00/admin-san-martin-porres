import { ColumnDef } from '@tanstack/react-table';
import type { PagoListItem } from '~/types/pagosNomina.types';

export const pagosColumns: ColumnDef<PagoListItem>[] = [
  {
    accessorKey: 'periodoNomina',
    header: 'Periodo',
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha del pago',
  },
  {
    accessorKey: 'nombreEmpleado',
    header: 'Nombre del empleado',
  },
  {
    accessorKey: 'totalNomina',
    header: 'Total pagado',
    cell: ({ row }) =>
      `Bs. ${row.original.totalNomina.toLocaleString('es-VE')}`,
  },
  {
    accessorKey: 'nombreUsuario',
    header: 'Registrado por',
  },
];
