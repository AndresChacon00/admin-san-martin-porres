import { ColumnDef } from '@tanstack/react-table';
import { Empleado } from '~/types/empleados.types';

export const empleadoColumns: ColumnDef<Empleado>[] = [
  {
    accessorKey: 'cedula',
    header: 'Cédula',
  },
  {
    accessorKey: 'nombreCompleto',
    header: 'Nombre',
  },
  {
    accessorKey: 'nombreCargo',
    header: 'Cargo',
  },
  {
    accessorKey: 'sexo',
    header: 'Sexo',
  },
  {
    accessorKey: 'fechaIngresoPlantel',
    header: 'Ingreso al Plantel',
    accessorFn: (row) => {
      return new Date(row.fechaIngresoPlantel).toLocaleDateString('es-VE', {
        timeZone: 'GMT',
      });
    },
  },
  {
    accessorKey: 'sueldo',
    header: 'Sueldo',
  },
  {
    accessorKey: 'religion',
    header: 'Religión',
  },
];
