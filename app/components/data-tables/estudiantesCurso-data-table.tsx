import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import * as React from 'react';
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
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from "../ui/input"
import { AgregarPagoModal } from '../crud/AgregarPagoModal';
import { EditarPagoModal } from '../crud/EditarPagoModal';
import { EliminarPagoModal } from '../crud/EliminarPagoModal';
import { Estudiante } from '~/types/estudiantes.types';
import { EliminarEstudianteCursoModal } from '../crud/EliminarEstudianteCursoModal';

interface DataTableProps {
  columns: ColumnDef<Estudiante>[];
  data: Estudiante[];
  idPeriodo: number;
  codigoCurso: string;
}

export function EstudiantesCursoDataTable({
  columns,
  data,
  idPeriodo,
  codigoCurso,
}: DataTableProps) {

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [action, setAction] = useState<'addPago' | 'editPago' | 'deletePago' | 'deleteEstudiante' | null>(null);

  return (
    <div className="rounded-md border">
      <div className="flex items-center py-4 pl-4">
        <Input
          placeholder="Filtrar por cédula"
          value={(table.getColumn("cedula")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("cedula")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis color="gray" aria-label="Opciones" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setAction('addPago');
                          setSelectedEstudiante(row.original);
                        }}
                      >
                        Agregar Pago
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          console.log('Opening Eliminar Estudiante Modal for:', row.original);
                          setAction('deleteEstudiante');
                          setSelectedEstudiante(row.original);
                        }}
                      >
                        Eliminar Estudiante
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sin resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Agregar Pago Modal */}
      {selectedEstudiante && action === 'addPago' && (
        <AgregarPagoModal
          idPeriodo={idPeriodo}
          codigoCurso={codigoCurso}
          idEstudiante={selectedEstudiante.id}
          open={action === 'addPago'}
          onClose={() => {
            setAction(null);
            setSelectedEstudiante(null);
          }}
        />
      )}

      {/* Eliminar Estudiante Modal */}
      {selectedEstudiante && action === 'deleteEstudiante' && (
        <EliminarEstudianteCursoModal
          idPeriodo={idPeriodo}
          codigoCurso={codigoCurso}
          idEstudiante={selectedEstudiante.id}
          nombreEstudiante={`${selectedEstudiante.nombre} ${selectedEstudiante.apellido}`}
          open={action === 'deleteEstudiante'}
          onClose={() => {
            setAction(null);
            setSelectedEstudiante(null);
          }}
        />
      )}

    </div>
  );
}