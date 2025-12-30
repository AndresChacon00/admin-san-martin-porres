import { ColumnDef } from '@tanstack/react-table';
import { Curso } from '~/types/cursos.types';

export const cursoColumns: ColumnDef<Curso>[] = [
  {
    accessorKey: 'codigo',
    header: 'Código',
    // display padded numeric codes to 4 digits on the frontend
    cell: ({ getValue }) => {
      const v = String(getValue() ?? '');
      if (/^\d+$/.test(v)) return v.padStart(4, '0');
      return v;
    },
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
    accessorKey: 'precioTotal',
    header: 'Precio Total',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'REF',
      });
    },
  },
];
