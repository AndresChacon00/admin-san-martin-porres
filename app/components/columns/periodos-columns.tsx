import { ColumnDef } from '@tanstack/react-table';
import { Link } from '@remix-run/react';

import { Periodo } from '~/types/periodos.types';
import { Button } from '../ui/button';

export const periodosColumns: ColumnDef<Periodo>[] = [
  {
    accessorKey: 'idPeriodo',
    header: 'ID Periodo',
  },
  {
    accessorKey: 'fechaInicio',
    header: 'Fecha de Inicio',
    accessorFn: (row) =>
      new Date(row.fechaInicio).toLocaleDateString('es-VE', {
        timeZone: 'GMT',
      }),
  },
  {
    accessorKey: 'fechaFin',
    header: 'Fecha de Fin',
    accessorFn: (row) =>
      new Date(row.fechaFin).toLocaleDateString('es-VE', {
        timeZone: 'GMT',
      }),
  },
  {
    id: 'verCursos',
    header: 'Cursos inscritos',
    cell: ({ row }) => (
      <Link to={`/periodos/${row.original.idPeriodo}`}>
        <Button variant='default' size='sm' className='link-button'>Ver Cursos</Button>
      </Link>
    ),
  },
];
