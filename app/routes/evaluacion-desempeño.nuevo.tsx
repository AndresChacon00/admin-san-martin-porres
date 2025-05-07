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
import { getEmpleadosForEvaluacionDesempeño } from '~/api/controllers/empleados.server';
import { createEvaluacionDesempeño } from '~/api/controllers/evaluacionesDesempeño.server';
import { getPeriodosEvaluacionDesmpeño } from '~/api/controllers/periodosEvaluacionDesempeño.server';
import CreatePeriodoEvaluacionDesempeñoDialog from '~/components/dialogs/create-periodo-evaluacion-desempeño';
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
import { evaluacionDesempeñoSchema } from '~/lib/validators';
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

  const periodos = getPeriodosEvaluacionDesmpeño();
  const empleados = getEmpleadosForEvaluacionDesempeño();
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
  const periodoId = formData.get('periodoId');
  const empleadoId = formData.get('empleadoId');
  const cargoEmpleado = formData.get('cargoEmpleado');
  const sueldoMensual = formData.get('sueldoMensual');
  const otrasPrimas = formData.get('otrasPrimas');
  const totalAsignacionesDiarias = formData.get('totalAsignacionesDiarias');
  const factorCalculo = formData.get('factorCalculo');
  const diasRangoObtenido = formData.get('diasRangoObtenido');
  const montoFinal = formData.get('montoFinal');
  if (
    !periodoId ||
    !empleadoId ||
    !cargoEmpleado ||
    !sueldoMensual ||
    !otrasPrimas ||
    !totalAsignacionesDiarias ||
    !factorCalculo ||
    !diasRangoObtenido ||
    !montoFinal
  ) {
    return { type: 'error', message: 'Complete los campos' };
  }

  const formValues = {
    periodoId: Number(periodoId),
    empleadoId: Number(empleadoId),
    cargoEmpleado: String(cargoEmpleado),
    sueldoMensual: Number(sueldoMensual),
    otrasPrimas: Number(otrasPrimas),
    totalAsignacionesDiarias: Number(totalAsignacionesDiarias),
    factorCalculo: Number(factorCalculo),
    diasRangoObtenido: Number(diasRangoObtenido),
    montoFinal: Number(montoFinal),
    registradoPorId: Number(userId),
  };
  return await createEvaluacionDesempeño(formValues);
}

export default function NuevaEvaluacionDesempeñoPage() {
  const { periodos, empleados } = useLoaderData<typeof loader>();
  const pagoFetcher = useFetcher<typeof action>();

  const form = useForm<z.infer<typeof evaluacionDesempeñoSchema>>({
    resolver: zodResolver(evaluacionDesempeñoSchema),
    defaultValues: {
      cargoEmpleado: '',
      sueldoMensual: 0,
      otrasPrimas: 0,
      totalAsignacionesDiarias: 0,
      factorCalculo: 4.01926,
      diasRangoObtenido: 0,
      montoFinal: 0,
    },
  });

  const [showDialog, setShowDialog] = useState(false);

  const handleEmpleadoChange = (empleadoId: string) => {
    if (empleadoId) {
      const empleado = empleados.find((e) => e.id === Number(empleadoId));
      if (empleado) {
        form.setValue('sueldoMensual', empleado.sueldoMensual);
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
        Cargar Pago de Evaluación de Desempeño
      </h1>
      <CreatePeriodoEvaluacionDesempeñoDialog
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
            name='periodoId'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>
                  Seleccione un periodo de evaluación de desempeño
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
            name='sueldoMensual'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Sueldo base mensual</RequiredLabel>
                <FormControl>
                  <Input {...field} disabled type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='otrasPrimas'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>
                  Otras primas según anexos administrativos
                </RequiredLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='totalAsignacionesDiarias'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>
                  Total asignaciones diarias (Col. 5/30)
                </RequiredLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='factorCalculo'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Factor de cálculo</RequiredLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='diasRangoObtenido'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>
                  Días según rango obtenido (muy bueno o bueno)
                </RequiredLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='montoFinal'
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>
                  Monto a pagar por prima de evaluación de desempeño
                </RequiredLabel>
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
