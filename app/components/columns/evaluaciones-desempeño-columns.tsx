import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { EvaluacionDesempeñoListItem } from '~/types/pagosEvaluacionDesempeño.types';

export function createEvaluacionesDesempeñoColumns(
  handleClick: (row: EvaluacionDesempeñoListItem) => void,
) {
  const columns: ColumnDef<EvaluacionDesempeñoListItem>[] = [
    {
      accessorKey: 'periodo',
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
      accessorKey: 'montoFinal',
      header: 'Monto',
      cell: ({ row }) =>
        `Bs. ${row.original.montoFinal.toLocaleString('es-VE')}`,
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
