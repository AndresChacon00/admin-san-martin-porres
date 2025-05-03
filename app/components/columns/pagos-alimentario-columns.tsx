import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { PagoAlimentarioListItem } from '~/types/pagosAlimentario.types';

export function createPagosAlimentarioColumns(
  handleClick: (row: PagoAlimentarioListItem) => void,
) {
  const columns: ColumnDef<PagoAlimentarioListItem>[] = [
    {
      accessorKey: 'periodoAlimentario',
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
      accessorKey: 'totalARecibir',
      header: 'Total pagado',
      cell: ({ row }) =>
        `Bs. ${row.original.totalARecibir.toLocaleString('es-VE')}`,
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
