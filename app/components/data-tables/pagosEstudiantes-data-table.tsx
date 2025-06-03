
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  
  import ReciboEstudiante from '~/components/ReciboEstudiantes';
  import { imprimirRecibo } from '~/components/ImprimirRecibo'; 
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
  import * as React from 'react';
  import { Input } from "../ui/input"
  import { PagoEstudiante, PagoEstudianteUpdate } from '~/types/pagosEstudiantesCurso.types';
  import { EditarPagoModal } from '../crud/EditarPagoModal';
  import { EliminarPagoModal } from '../crud/EliminarPagoModal';
  
  
  interface DataTableProps {
    columns: ColumnDef<PagoEstudiante>[];
    data: PagoEstudiante[];
    onGenerateReceipt: (idPago: number) => void;
  }
  
  export function DataTablePagosEstudiantes({ columns, data, onGenerateReceipt }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting,
        columnFilters,
      },   
    });
  
    const [selectedPago, setSelectedPago] = useState<PagoEstudiante | null>(null);
    const [action, setAction] = useState<'edit' | 'delete' | 'generateReceipt'| null>(null);
  
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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                        <Ellipsis color="gray" aria-label="Opciones" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setAction('edit');
                            setSelectedPago(row.original);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setAction('delete');
                            setSelectedPago(row.original);
                          }}
                        >
                          Eliminar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        onClick={() => onGenerateReceipt(row.original.idPago)}
                      >
                        Generar Recibo
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
  
        {/* Editar Pago Modal */}
        {selectedPago && action === 'edit' && (
          <EditarPagoModal
            pago={selectedPago}
            open={action === 'edit'}
            onClose={() => {
              setAction(null);
              setSelectedPago(null);
            }}
          />
        )}
  
        {/* Eliminar Pago Modal */}
        {selectedPago && action === 'delete' && (
          <EliminarPagoModal
            idPago={selectedPago.idPago}
            open={action === 'delete'}
            onClose={() => {
              setAction(null);
              setSelectedPago(null);
            }}
          />
        )}

      </div>
    );
  }