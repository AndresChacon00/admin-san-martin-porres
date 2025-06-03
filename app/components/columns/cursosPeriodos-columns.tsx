import { ColumnDef } from '@tanstack/react-table';
import { Curso } from '~/types/cursos.types';
import { Link } from '@remix-run/react';
import { Button } from "../ui/button";


export const cursoColumnsWithActions = (idPeriodo: number): ColumnDef<Curso>[] => [
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
    accessorKey: 'horario',
    header: 'Horario',
  },
  {
    accessorKey: 'precioTotal',
    header: 'Precio Total',
  },
];
