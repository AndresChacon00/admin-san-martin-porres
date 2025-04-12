import { ColumnDef } from '@tanstack/react-table';
import { Estudiante } from '~/types/estudiantes.types';

export const estudiantesCursoColumns: ColumnDef<Estudiante>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'cedula',
    header: 'Cédula',
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'apellido',
    header: 'Apellido',
  },
  {
    accessorKey: 'correo',
    header: 'Correo',
  },

  {
    accessorKey: 'telefono',
    header: 'Teléfono',
  },
  {
    accessorKey: 'direccion',
    header: 'Dirección',
  },
];
