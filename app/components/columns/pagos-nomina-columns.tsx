import type { ColumnDef } from '@tanstack/react-table';
import type { PagoListItem } from '~/types/pagosNomina.types';
import { Button } from '../ui/button';

export function createPagosColumns(handleClick: (row: PagoListItem) => void) {
  const columns: ColumnDef<PagoListItem>[] = [
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
    {
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <Button
            onClick={() => handleClick(row.original)}
            size='sm'
            className='link-button'
          >
            Generar recibo
          </Button>
        );
      },
    },
  ];
  return columns;
}
