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
import { EditarEstudianteModal } from '../crud/EditarEstudianteModal';
import { EliminarEstudianteModal } from '../crud/EliminarEstudianteModal';
import { Estudiante } from '~/types/estudiantes.types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface DataTableProps {
  columns: ColumnDef<Estudiante>[];
  data: Estudiante[];
}

export function DataTableEstudiantes({ columns, data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [selectedEstudiante, setSelectedEstudiante] =
    useState<Estudiante | null>(null);
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
                          setSelectedEstudiante(row.original);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setAction('delete');
                          setSelectedEstudiante(row.original);
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

      {/* Editar Estudiante Modal */}
      <Dialog
        open={action === 'edit'}
        onOpenChange={(open) => {
          if (!open) {
            setAction(null);
            setSelectedEstudiante(null);
          }
        }}
      >
        {selectedEstudiante && (
          <EditarEstudianteModal
            estudiante={selectedEstudiante}
            open={action === 'edit'} // Pass the open state
            onClose={() => {
              setAction(null); // Reset the action state
              setSelectedEstudiante(null); // Clear the selected student
            }}
          />
        )}
      </Dialog>

      {/* Eliminar Estudiante Modal */}
      {selectedEstudiante && action === 'delete' && (
        <EliminarEstudianteModal
          estudiante={selectedEstudiante}
          open={action === 'delete'}
          onClose={() => {
            setAction(null);
            setSelectedEstudiante(null);
          }}
        />
      )}
    </div>
  );
}
