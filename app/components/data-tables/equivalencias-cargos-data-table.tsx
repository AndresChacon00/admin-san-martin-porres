import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { EquivalenciaCargo } from '~/types/equivalencias.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { editEquivalenciasCargosSchema } from '~/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { equivCargos } from '~/api/tables/equivCargos';
import { NivelSelect } from '~/types/niveles.types';
import { CargoSelect } from '~/types/cargos.types';

interface DataTableProps {
  columns: ColumnDef<EquivalenciaCargo>[];
  data: EquivalenciaCargo[];
  deleteEquivalencia: (id: number) => void;
  editEquivalencia: (
    id: number,
    data: Partial<typeof equivCargos.$inferInsert>,
  ) => void;
  niveles: NivelSelect[];
  cargos: CargoSelect[];
}

export function DataTable({
  columns,
  data,
  deleteEquivalencia,
  editEquivalencia,
  niveles,
  cargos,
}: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  const [action, setAction] = useState<'delete' | 'edit' | null>(null);
  const [selected, setSelected] = useState<EquivalenciaCargo | null>(null);

  const form = useForm<z.infer<typeof editEquivalenciasCargosSchema>>({
    resolver: zodResolver(editEquivalenciasCargosSchema),
    defaultValues: {
      tipoPersonal: 'administrativo',
      nivel: 1,
      cargo: 1,
    },
  });

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanFilter() && (
                            <Select
                              value={header.column.getFilterValue() as string}
                              onValueChange={header.column.setFilterValue}
                            >
                              <SelectTrigger className='my-1'>
                                <SelectValue placeholder='Filtrar' />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  header.column.getFacetedUniqueValues().keys(),
                                ).map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
                            setSelected(row.original);
                            form.setValue('cargo', row.original.cargoId);
                            form.setValue('nivel', row.original.nivelId);
                            form.setValue(
                              'tipoPersonal',
                              row.original.tipoPersonal,
                            );
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setAction('delete');
                            setSelected(row.original);
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
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>

      {/* Delete confirmation dialog */}
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
            <DialogTitle>
              ¿Seguro que desea eliminar esta equivalencia?
            </DialogTitle>
          </DialogHeader>
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
                  deleteEquivalencia(selected.id);
                  setSelected(null);
                  setAction(null);
                }
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={action === 'edit'}
        onOpenChange={(open) => {
          if (!open) {
            setAction(null);
            setSelected(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar</DialogTitle>
          </DialogHeader>
          {selected && (
            <Form {...form}>
              <form
                className='space-y-4'
                onSubmit={form.handleSubmit((data) => {
                  editEquivalencia(selected.id, data);
                  setSelected(null);
                  setAction(null);
                })}
              >
                <FormField
                  control={form.control}
                  name='tipoPersonal'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Personal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccione un tipo de personal' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='instructor'>Instructor</SelectItem>
                          <SelectItem value='administrativo'>
                            Administrativo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='nivel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccione un nivel' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {niveles.map((nivel) => (
                            <SelectItem key={nivel.id} value={String(nivel.id)}>
                              {nivel.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='cargo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccione un cargo' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cargos.map((cargo) => (
                            <SelectItem key={cargo.id} value={String(cargo.id)}>
                              {cargo.nombreCargo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className='link-button w-full'>Guardar cambios</Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
