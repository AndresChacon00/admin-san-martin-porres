import { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import {
  getEquivalenciasCargos,
  getEquivalenciasGrados,
  getEquivalenciasNiveles,
  updateEquivalenciaNivel,
} from '~/api/controllers/equivalencias.server';
import { equivalenciasGradosColumns } from '~/components/columns/equivalencias-grados-columns';
import { DataTable as DataTableGrados } from '~/components/data-tables/equivalencias-grados-data-table';
import { DataTable as DataTableCargos } from '~/components/data-tables/equivalencias-cargos-data-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  EquivalenciaCargo,
  EquivalenciaGrado,
  EquivalenciaNivel,
} from '~/types/equivalencias.types';
import { equivalenciasCargosColumns } from '~/components/columns/equivalencias-cargos-columns';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { equivalenciasNivelesSchema } from '~/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { toast } from 'sonner';

export const meta: MetaFunction = () => {
  return [
    { title: 'Configurar Equivalencias | San Martín de Porres' },
    {
      name: 'description',
      content: 'Configurar equivalencias de niveles, grados y cargos',
    },
  ];
};

export async function loader() {
  const equivalenciasNiveles = getEquivalenciasNiveles();
  const equivalenciasGrados = getEquivalenciasGrados('todos');
  const equivalenciasCargos = getEquivalenciasCargos('todos');
  return await Promise.all([
    equivalenciasNiveles,
    equivalenciasGrados,
    equivalenciasCargos,
  ]);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  let action = formData.get('_action');
  if (!action) {
    return { type: 'error', message: 'Acción no válida' };
  }
  action = String(action);

  if (action === 'update-nivel') {
    const id = formData.get('id');
    const minTiempoServicio = formData.get('minTiempoServicio');
    const formacionCrecimientoPersonal = formData.get(
      'formacionCrecimientoPersonal',
    );
    if (!id || !minTiempoServicio || !formacionCrecimientoPersonal) {
      return { type: 'error', message: 'Datos incompletos' };
    }
    const response = await updateEquivalenciaNivel(Number(id), {
      minTiempoServicio: Number(minTiempoServicio),
      formacionCrecimientoPersonal: String(formacionCrecimientoPersonal),
    });
    return response;
  }
  return { type: 'error', message: 'Acción no válida' };
}

export default function EquivalenciasPage() {
  const [equivalenciasNiveles, equivalenciasGrados, equivalenciasCargos] =
    useLoaderData<typeof loader>();

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>Equivalencias</h1>
      <Tabs defaultValue='niveles'>
        <TabsList>
          <TabsTrigger value='niveles'>Niveles</TabsTrigger>
          <TabsTrigger value='grados'>Grados</TabsTrigger>
          <TabsTrigger value='cargos'>Cargos</TabsTrigger>
        </TabsList>

        <NivelesTab equivalenciasNiveles={equivalenciasNiveles} />
        <GradosTab equivalenciasGrados={equivalenciasGrados} />
        <CargosTab equivalenciasCargos={equivalenciasCargos} />
      </Tabs>
    </div>
  );
}

function NivelesTab({
  equivalenciasNiveles,
}: {
  equivalenciasNiveles: EquivalenciaNivel[];
}) {
  const [equivEditing, setEquivEditing] = useState<EquivalenciaNivel | null>(
    null,
  );

  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      if (fetcher.data.type === 'success') {
        toast.success(fetcher.data.message);
        setEquivEditing(null);
      } else if (fetcher.data.type === 'error') {
        toast.error(fetcher.data.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  const form = useForm<z.infer<typeof equivalenciasNivelesSchema>>({
    resolver: zodResolver(equivalenciasNivelesSchema),
    defaultValues: {
      minTiempoServicio: 0,
      formacionCrecimientoPersonal: 'NO REQUIERE',
    },
  });

  const selectEditing = (equiv: EquivalenciaNivel) => {
    form.setValue('minTiempoServicio', equiv.minTiempoServicio);
    form.setValue(
      'formacionCrecimientoPersonal',
      equiv.formacionCrecimientoPersonal,
    );
    setEquivEditing(equiv);
  };

  return (
    <TabsContent value='niveles'>
      <h2 className='font-bold mt-4'>Equivalencias de Niveles</h2>
      <Table className='w-2/3 mt-2'>
        <TableHeader>
          <TableRow>
            <TableHead>Nivel</TableHead>
            <TableHead>Tiempo Mínimo de Servicio en Centros AVEC</TableHead>
            <TableHead>
              Formación Permanente en el Área de Crecimiento Personal
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {equivalenciasNiveles.map((equiv) => (
            <TableRow key={equiv.nivelId}>
              <TableCell className='font-semibold'>
                {equiv.nombreNivel}
              </TableCell>
              <TableCell>{equiv.minTiempoServicio} años</TableCell>
              <TableCell>{equiv.formacionCrecimientoPersonal}</TableCell>
              <TableCell>
                <Button variant='outline' onClick={() => selectEditing(equiv)}>
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit dialog */}
      <Dialog open={!!equivEditing} onOpenChange={() => setEquivEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className='space-y-4'
              onSubmit={form.handleSubmit((data) => {
                if (equivEditing) {
                  fetcher.submit(
                    { ...data, id: equivEditing.id, _action: 'update-nivel' },
                    { method: 'post' },
                  );
                }
              })}
            >
              <p>
                <b>Nivel:</b> {equivEditing?.nombreNivel}
              </p>
              <FormField
                control={form.control}
                name='minTiempoServicio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo mínimo de servicio (en años)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ingresar tiempo'
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
                name='formacionCrecimientoPersonal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Formación permanente en el área de crecimiento personal
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ingresar requerimiento de formación'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='link-button w-full'>
                Guardar cambios
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}

function GradosTab({
  equivalenciasGrados,
}: {
  equivalenciasGrados: EquivalenciaGrado[];
}) {
  return (
    <TabsContent value='grados'>
      <h2 className='font-bold mt-4'>Equivalencias de Grados</h2>
      <div className='mt-2 w-4/5'>
        <DataTableGrados
          columns={equivalenciasGradosColumns}
          data={equivalenciasGrados}
        />
      </div>
    </TabsContent>
  );
}

function CargosTab({
  equivalenciasCargos,
}: {
  equivalenciasCargos: EquivalenciaCargo[];
}) {
  return (
    <TabsContent value='cargos'>
      <h2 className='font-bold mt-4'>Equivalencias de Cargos</h2>
      <div className='mt-2 w-4/5'>
        <DataTableCargos
          columns={equivalenciasCargosColumns}
          data={equivalenciasCargos}
        />
      </div>
    </TabsContent>
  );
}
