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
import { Periodo } from '~/types/periodos.types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { EditarPeriodoModal } from '../crud/EditarPeriodoModal';
import { EliminarPeriodoModal } from '../crud/EliminarPeriodoModal';
import { Link } from '@remix-run/react';

interface DataTableProps {
  columns: ColumnDef<Periodo>[];
  data: Periodo[];
}

export function PeriodosDataTable({ columns, data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo | null>(null);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis color='gray' aria-label='Opciones' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setAction('edit');
                          setSelectedPeriodo(row.original);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setAction('delete');
                          setSelectedPeriodo(row.original);
                        }}
                      >
                        Eliminar
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/periodos/${row.original.idPeriodo}`}>
                          Ver Cursos
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                Sin resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Editar Periodo Modal */}
      {selectedPeriodo && (
        <EditarPeriodoModal
          periodo={selectedPeriodo}
          open={action === 'edit'}
          onClose={() => {
            setAction(null);
            setSelectedPeriodo(null);
          }}
        />
      )}

      {/* Eliminar Periodo Modal */}
      {selectedPeriodo && (
        <EliminarPeriodoModal
          periodo={selectedPeriodo}
          open={action === 'delete'}
          onClose={() => {
            setAction(null);
            setSelectedPeriodo(null);
          }}
        />
      )}
    </div>
  );
}
