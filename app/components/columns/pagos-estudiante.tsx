import { ColumnDef } from '@tanstack/react-table';
import { PagoEstudiante } from '~/types/pagosEstudiantesCurso.types';
import { ArrowUpDown } from "lucide-react"
import { Button } from '../ui/button';
export const pagosColumns: ColumnDef<PagoEstudiante>[] = [
  {
    accessorKey: 'idPago',
    header: 'ID Pago',
  },
  {
    accessorKey: 'cedula',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cédula
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha de Pago',
    accessorFn: (row) => {
      return row.fecha ? new Date(row.fecha).toLocaleDateString() : '';
    },
  },
  {
    accessorKey: 'tipoPago',
    header: 'Tipo de Pago',
  },
  {
    accessorKey: 'comprobante',
    header: 'Comprobante',
  },
];
