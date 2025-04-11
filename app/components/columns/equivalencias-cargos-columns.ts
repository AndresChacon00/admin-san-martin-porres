import { ColumnDef } from '@tanstack/react-table';
import { EquivalenciaCargo } from '~/types/equivalencias.types';

export const equivalenciasCargosColumns: ColumnDef<EquivalenciaCargo>[] = [
  {
    accessorKey: 'tipoPersonal',
    header: 'Tipo de Personal',
    accessorFn: (row) =>
      row.tipoPersonal[0].toUpperCase() + row.tipoPersonal.slice(1),
    minSize: 800,
  },
  {
    accessorKey: 'nombreCargo',
    header: 'Cargo',
    enableColumnFilter: false,
  },
  {
    accessorKey: 'nombreNivel',
    header: 'Nivel del Empleado',
  },
];
