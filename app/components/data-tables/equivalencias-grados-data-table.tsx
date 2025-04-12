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
import { EquivalenciaGrado } from '~/types/equivalencias.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { editEquivalenciasGradosSchema } from '~/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { TituloSelect } from '~/types/titulos.types';
import { Input } from '../ui/input';
import { equivGrados } from '~/api/tables/equivGrados';

interface DataTableProps {
  columns: ColumnDef<EquivalenciaGrado>[];
  data: EquivalenciaGrado[];
  titulos: TituloSelect[];
  deleteEquivalencia: (id: number) => void;
  editEquivalencia: (
    id: number,
    data: Partial<typeof equivGrados.$inferInsert>,
  ) => void;
}

export function DataTable({
  columns,
  data,
  titulos,
  deleteEquivalencia,
  editEquivalencia,
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
  const [selected, setSelected] = useState<EquivalenciaGrado | null>(null);

  const form = useForm<z.infer<typeof editEquivalenciasGradosSchema>>({
    resolver: zodResolver(editEquivalenciasGradosSchema),
    defaultValues: {
      titulo: undefined,
      experienciaLaboral: undefined,
      formacionTecnicoProfesional: '',
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
                            form.setValue(
                              'experienciaLaboral',
                              row.original.experienciaLaboral,
                            );
                            form.setValue(
                              'formacionTecnicoProfesional',
                              row.original.formacionTecnicoProfesional,
                            );
                            form.setValue('titulo', row.original.tituloId);
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
          if (open) {
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
          if (open) {
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
                <p>
                  <b>Tipo de Personal:</b>{' '}
                  {selected.tipoPersonal[0].toUpperCase() +
                    selected.tipoPersonal.slice(1)}
                </p>
                <p>
                  <b>Grado del Empleado:</b> {selected.nombreGrado}
                </p>
                <FormField
                  control={form.control}
                  name='titulo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccione un título' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {titulos.map((titulo) => (
                            <SelectItem
                              key={titulo.id}
                              value={String(titulo.id)}
                            >
                              {titulo.nombre}
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
                  name='experienciaLaboral'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiencia Laboral (años)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Años de experiencia laboral'
                          type='number'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='formacionTecnicoProfesional'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Formación Permanente en el Área Técnico Profesional
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Horas de formación' {...field} />
                      </FormControl>
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
