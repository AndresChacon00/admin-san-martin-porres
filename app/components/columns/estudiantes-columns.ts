import { ColumnDef } from '@tanstack/react-table';
import { Estudiante } from '~/types/estudiantes.types';

export const estudiantesColumns: ColumnDef<Estudiante>[] = [
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
    accessorKey: 'fechaNacimiento',
    header: 'Fecha de Nacimiento',
    accessorFn: (row) => {
      return row.fechaNacimiento
        ? new Date(row.fechaNacimiento).toLocaleDateString()
        : '';
    },
  },
  {
    accessorKey: 'edad',
    header: 'Edad',
  },
  {
    accessorKey: 'sexo',
    header: 'Sexo',
  },
  {
    accessorKey: 'ultimoAñoCursado',
    header: 'Ultimo Año Cursado',
  },
  {
    accessorKey: 'religion',
    header: 'Religión',
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
