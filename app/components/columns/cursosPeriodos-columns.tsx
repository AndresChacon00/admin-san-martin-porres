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
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ getValue }) => (getValue() === 1 ? 'Activo' : 'Inactivo'),
  },
  {
    accessorKey: 'precioTotal',
    header: 'Precio Total',
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row }) => {
      const codigo = row.original.codigo;
      return (
        <Link
          to={`/periodos/${idPeriodo}/curso/${codigo}`}
        >
          <Button variant="outline">Ver alumnos inscritos</Button>
        </Link>
      );
    },
  },
];
