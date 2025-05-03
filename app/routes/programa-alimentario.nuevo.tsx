import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { getEmpleadosForProgramaAlimentario } from '~/api/controllers/empleados.server';
import { createPagoAlimentario } from '~/api/controllers/pagosAlimentario.server';
import { getPeriodosAlimentario } from '~/api/controllers/periodosAlimentario.server';
import CreatePeriodoAlimentarioDialog from '~/components/dialogs/create-periodo-alimentario';
import RequiredLabel from '~/components/forms/required-label';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { isRole } from '~/lib/auth';
import { pagoAlimentarioSchema } from '~/lib/validators';
import { getSession } from '~/sessions';

export const meta: MetaFunction = () => {
  return [
    { title: 'Cargar Pago de Programa Alimentario | San Martín de Porres' },
    {
      name: 'description',
      content: 'Programa Alimentario de empleados',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }

  const periodos = getPeriodosAlimentario();
  const empleados = getEmpleadosForProgramaAlimentario();
  const result = await Promise.all([periodos, empleados]);
  return {
    periodos: result[0],
    empleados: result[1],
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  if (!userId) {
    return redirect('/');
  }

  const formData = await request.formData();
  const periodoAlimentarioId = formData.get('periodoAlimentarioId');
  const empleadoId = formData.get('empleadoId');
  const cargoEmpleado = formData.get('cargoEmpleado');
  const horasSemanales = formData.get('horasSemanales');
  const totalBeneficio = formData.get('totalBeneficio');
  const descuentoInasistencia = formData.get('descuentoInasistencia');
  if (
    !periodoAlimentarioId ||
    !empleadoId ||
    !cargoEmpleado ||
    !horasSemanales ||
    !totalBeneficio ||
    !descuentoInasistencia
  ) {
    return { type: 'error', message: 'complete los campos' };
  }

  const formValues = {
    periodoAlimentarioId: Number(periodoAlimentarioId),
    empleadoId: Number(empleadoId),
    cargoEmpleado: String(cargoEmpleado),
    horasSemanales: Number(horasSemanales),
    totalBeneficio: Number(totalBeneficio),
    descuentoInasistencia: Number(descuentoInasistencia),
    totalARecibir: Number(totalBeneficio) - Number(descuentoInasistencia),
    registradoPorId: Number(userId),
  };
  return await createPagoAlimentario(formValues);
}

export default function NuevoPagoNominaPage() {
  const { periodos, empleados } = useLoaderData<typeof loader>();
  const pagoFetcher = useFetcher<typeof action>();

  const form = useForm<z.infer<typeof pagoAlimentarioSchema>>({
    resolver: zodResolver(pagoAlimentarioSchema),
    defaultValues: {
      horasSemanales: 0,
      totalBeneficio: 0,
      descuentoInasistencia: 0,
    },
  });

  const [showDialog, setShowDialog] = useState(false);

  const handleEmpleadoChange = (empleadoId: string) => {
    if (empleadoId) {
      const empleado = empleados.find((e) => e.id === Number(empleadoId));
      if (empleado) {
        form.setValue('horasSemanales', empleado.horasSemanales);
      }
    }
  };

  useEffect(() => {
    if (pagoFetcher.state === 'idle' && pagoFetcher.data !== undefined) {
      if (pagoFetcher.data.type === 'success') {
        toast.success('Pago registrado con éxito');
        form.reset();
      } else if (pagoFetcher.data.type === 'error') {
        toast.error(pagoFetcher.data.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagoFetcher.state, pagoFetcher.data]);

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>
        Cargar Pago de Programa Alimentario
      </h1>
      <CreatePeriodoAlimentarioDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
      <Form {...form}>
        <form
          className='space-y-3 w-1/2'
          onSubmit={form.handleSubmit((values) =>
            pagoFetcher.submit(values, { method: 'POST' }),
          )}
        >
          <FormField
            control={form.control}
            name='periodoAlimentarioId'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>
                  Seleccione un periodo de programa alimentario
                </RequiredLabel>
                <div className='flex gap-3'>
                  <div className='flex-1'>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Ejemplo: Enero 2024' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {periodos.map((periodo) => (
                          <SelectItem
                            key={periodo.id}
                            value={String(periodo.id)}
                          >
                            {periodo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                  <Button
                    type='button'
                    className='link-button'
                    onMouseDown={() => setShowDialog(true)}
                  >
                    Crear periodo nuevo
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='empleadoId'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Seleccione un empleado</RequiredLabel>
                <Select
                  onValueChange={(value) => {
                    handleEmpleadoChange(value);
                    field.onChange(value);
                  }}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar empleado' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {empleados.map((empleado) => (
                      <SelectItem key={empleado.id} value={String(empleado.id)}>
                        {empleado.nombre} - {empleado.cedula}
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
            name='cargoEmpleado'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Cargo del empleado</RequiredLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Instructor, Obrero, Administrativo...'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='horasSemanales'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Horas laborales semanales</RequiredLabel>
                <FormControl>
                  <Input {...field} disabled type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='totalBeneficio'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Total beneficio alimentario</RequiredLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='descuentoInasistencia'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Descuento de inasistencia</RequiredLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className='link-button w-full'
            type='submit'
            disabled={pagoFetcher.state === 'submitting'}
          >
            Guardar pago
          </Button>
        </form>
      </Form>
    </div>
  );
}
