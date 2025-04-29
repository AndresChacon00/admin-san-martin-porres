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
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { AgregarPagoModal } from '../crud/AgregarPagoModal';
import { EditarPagoModal } from '../crud/EditarPagoModal';
import { EliminarPagoModal } from '../crud/EliminarPagoModal';
import { Estudiante } from '~/types/estudiantes.types';

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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [selectedPago, setSelectedPago] = useState<{
    idPago: number;
    idPeriodo: number;
    codigoCurso: string;
    idEstudiante: number;
  } | null>(null);
  const [action, setAction] = useState<'addPago' | 'editPago' | 'deletePago' | null>(null);

  return (
    <div className="rounded-md border">
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
                          setAction('editPago');
                          setSelectedPago({
                            idPago: 1, // Replace with actual ID
                            idPeriodo,
                            codigoCurso,
                            idEstudiante: row.original.id,
                          });
                        }}
                      >
                        Editar Pago
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setAction('deletePago');
                          setSelectedPago({
                            idPago: 1, // Replace with actual ID
                            idPeriodo,
                            codigoCurso,
                            idEstudiante: row.original.id,
                          });
                        }}
                      >
                        Eliminar Pago
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

      {/* Editar Pago Modal */}
      {selectedPago && action === 'editPago' && (
        <EditarPagoModal
          pago={{
            idPago: selectedPago.idPago,
            idPeriodo: selectedPago.idPeriodo,
            codigoCurso: selectedPago.codigoCurso,
            idEstudiante: selectedPago.idEstudiante,
            monto: 0, // Replace with actual data
            fecha: '', // Replace with actual data
            tipoPago: '', // Replace with actual data
            comprobante: '', // Replace with actual data
          }}
          open={action === 'editPago'}
          onClose={() => {
            setAction(null);
            setSelectedPago(null);
          }}
        />
      )}

      {/* Eliminar Pago Modal */}
      {selectedPago && action === 'deletePago' && (
        <EliminarPagoModal
          idPago={selectedPago.idPago}
          open={action === 'deletePago'}
          onClose={() => {
            setAction(null);
            setSelectedPago(null);
          }}
        />
      )}
    </div>
  );
}