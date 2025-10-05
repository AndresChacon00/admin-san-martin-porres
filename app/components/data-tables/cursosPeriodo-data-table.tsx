import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { Curso } from '~/types/cursos.types';
import { useState } from 'react';
import { Link } from '@remix-run/react';
import { Button } from '../ui/button';
import { EliminarCursoPeriodoModal } from '../crud/EliminarCursoPeriodoModal';

interface DataTableProps {
  columns: ColumnDef<Curso>[];
  data: Curso[];
  idPeriodo: string;
}

export function CursosPeriodosDataTable({
  columns,
  data,
  idPeriodo,
}: DataTableProps) {
  const extendedColumns: ColumnDef<Curso>[] = [
    ...columns,
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const codigo = row.original.codigo;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis color='gray' aria-label='Opciones' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to={`/periodos/${idPeriodo}/curso/${codigo}`}>
                  Ver alumnos inscritos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setAction('delete');
                  setSelectedCurso(row.original);
                }}
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns: extendedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={extendedColumns.length}
                className='h-24 text-center'
              >
                Sin resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Eliminar Curso del Periodo Modal */}
      {selectedCurso && action === 'delete' && (
        <EliminarCursoPeriodoModal
          idPeriodo={idPeriodo}
          codigoCurso={selectedCurso.codigo}
          open={action === 'delete'}
          onClose={() => {
            setAction(null);
            setSelectedCurso(null);
          }}
        />
      )}
    </div>
  );
}
