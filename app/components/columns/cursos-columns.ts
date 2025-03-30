import { ColumnDef } from '@tanstack/react-table';
import { Curso } from '~/types/cursos.types';

export const cursoColumns: ColumnDef<Curso>[] = [
  {
    accessorKey: 'codigo',
    header: 'Código',
  },
  {
    accessorKey: 'nombreCurso',
    header: 'Nombre del Curso',
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ getValue }) => (getValue() === 1 ? 'Activo' : 'Inactivo'),
  },
  {
    accessorKey: 'precioTotal',
    header: 'Precio Total',
  },
];
