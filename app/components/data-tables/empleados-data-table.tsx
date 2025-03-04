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
import { useState } from 'react';
import { Empleado } from '~/types/empleados.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface DataTableProps {
  columns: ColumnDef<Empleado>[];
  data: Empleado[];
  deleteEmployee: (id: number) => void;
}

export function DataTable({ columns, data, deleteEmployee }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [selected, setSelected] = useState<number | null>(null);
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis color='gray' aria-label='Opciones' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setAction('edit');
                          setSelected(row.original.id);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setAction('delete');
                          setSelected(row.original.id);
                        }}
                      >
                        Eliminar
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

      <Dialog
        open={action === 'delete'}
        onOpenChange={(open) => {
          if (!open) {
            setAction(null);
            setSelected(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Seguro que desea eliminar este empleado?</DialogTitle>
          </DialogHeader>
          <>
            <p>Esta acción no se puede revertir.</p>
            <div className='flex flex-1 justify-end gap-4'>
              <Button
                variant='outline'
                className='bg-gray-200'
                onClick={() => {
                  setSelected(null);
                  setAction(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant='destructive'
                onClick={() => {
                  if (selected) {
                    deleteEmployee(selected);
                    setSelected(null);
                    setAction(null);
                  }
                }}
              >
                Eliminar
              </Button>
            </div>
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
}
