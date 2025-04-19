import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getEmpleadosForNomina } from '~/api/controllers/empleados.server';
import { createPago } from '~/api/controllers/pagosNomina.server';
import { getPeriodosNomina } from '~/api/controllers/periodosNomina.server';
import CreatePeriodoNominaDialog from '~/components/dialogs/create-periodo-nomina';
import RequiredLabel from '~/components/forms/required-label';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { pagoNominaSchema } from '~/lib/validators';
import { getSession } from '~/sessions';

export const meta: MetaFunction = () => {
  return [
    { title: 'Cargar Pago de Nómina | San Martín de Porres' },
    {
      name: 'description',
      content: 'Nómina de empleados',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }

  const periodos = getPeriodosNomina();
  const empleados = getEmpleadosForNomina();
  const result = await Promise.all([periodos, empleados]);
  return { periodos: result[0], empleados: result[1] };
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  if (!userId) {
    return redirect('/');
  }

  const formData = await request.formData();
  const periodoId = Number(formData.get('periodoNominaId'));
  const empleadoId = Number(formData.get('empleadoId'));
  const cargoEmpleado = String(formData.get('cargoEmpleado'));
  const sueldoBaseMensual = Number(formData.get('sueldoBaseMensual'));
  const primaAntiguedad = Number(formData.get('primaAntiguedad'));
  const primaAcademica = Number(formData.get('primaAcademica'));
  const primaPorHijo = Number(formData.get('primaPorHijo'));
  const primaCompensatoria = Number(formData.get('primaCompensatoria'));
  const bonoNocturno = Number(formData.get('bonoNocturno'));
  const horasExtrasNocturnas = Number(formData.get('horasExtrasNocturnas'));
  const horasExtrasDiurnas = Number(formData.get('horasExtrasDiurnas'));
  const feriadosTrabajados = Number(formData.get('feriadosTrabajados'));
  const retroactivos = Number(formData.get('retroactivos'));
  const leyPoliticaHabitacionalFaov = Number(
    formData.get('leyPoliticaHabitacionalFaov'),
  );
  const descuentoSso = Number(formData.get('descuentoSso'));
  const descuentoSpf = Number(formData.get('descuentoSpf'));
  const result = await createPago({
    registradoPorId: Number(userId),
    periodoNominaId: periodoId,
    empleadoId,
    cargoEmpleado,
    sueldoBaseMensual,
    primaAntiguedad,
    primaAcademica,
    primaPorHijo,
    primaCompensatoria,
    bonoNocturno,
    horasExtrasNocturnas,
    horasExtrasDiurnas,
    feriadosTrabajados,
    retroactivos,
    leyPoliticaHabitacionalFaov,
    descuentoSso,
    descuentoSpf,
  });
  return result;
}

export default function NuevoPagoNominaPage() {
  const { periodos, empleados } = useLoaderData<typeof loader>();

  const form = useForm<z.infer<typeof pagoNominaSchema>>({
    resolver: zodResolver(pagoNominaSchema),
    defaultValues: {
      periodoNominaId: undefined,
      empleadoId: undefined,
    },
  });

  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>Cargar Pago de Nómina</h1>
      <Form {...form}>
        <form className='space-y-2 w-1/2'>
          <FormField
            name='periodoNominaId'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Seleccione un periodo de nómina</RequiredLabel>
                <div className='flex gap-3'>
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
                        <SelectItem key={periodo.id} value={String(periodo.id)}>
                          {periodo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          <CreatePeriodoNominaDialog
            open={showDialog}
            onClose={() => setShowDialog(false)}
          />

          <FormField
            name='empleadoId'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Seleccione un empleado</RequiredLabel>
                <Select
                  onValueChange={field.onChange}
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
            name='cargoEmpleado'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Tipo de empleado</RequiredLabel>
                <FormControl>
                  <Input
                    placeholder='Instructor, Obrero, Administrativo...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='sueldoBaseMensual'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Sueldo base mensual</RequiredLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar sueldo'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className='text-lg font-semibold pt-2'>Asignaciones</p>

          <FormField
            name='primaAntiguedad'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Prima de antigüedad</RequiredLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar prima'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='primaAcademica'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Prima académica</RequiredLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar prima'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='primaPorHijo'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Prima por hijo</RequiredLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar prima'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='primaCompensatoria'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Prima compensatoria</RequiredLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar prima'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className='text-lg font-semibold pt-2'>Bonos adicionales</p>
          <FormField
            name='bonoNocturno'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bono nocturno</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar bono'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='horasExtrasNocturnas'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bono por horas extras nocturnas</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar bono'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='horasExtrasDiurnas'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bono por horas extras diurnas</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar bono'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='feriadosTrabajados'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bono por feriados trabajados</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar bono'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='retroactivos'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retroactivos</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar retroactivos'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className='text-lg font-semibold pt-2'>Deducciones</p>
          <FormField
            name='leyPoliticaHabitacionalFaov'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>
                  Deducción Ley Política Habitacional FAOV
                </RequiredLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar deducción'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='descuentoSso'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Deducción SSO</RequiredLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar deducción'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='descuentoSpf'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Deducción SPF</RequiredLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='Ingresar deducción'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='link-button w-full' type='submit'>
            Guardar pago
          </Button>
        </form>
      </Form>
    </div>
  );
}
