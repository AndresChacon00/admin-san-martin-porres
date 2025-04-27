import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { getEmpleadosForNomina } from '~/api/controllers/empleados.server';
import { createPago } from '~/api/controllers/pagosNomina.server';
import { getPeriodosNomina } from '~/api/controllers/periodosNomina.server';
import {
  getAllPrimas,
  getAllPrimasForEmpleado,
} from '~/api/controllers/primas.server';
import CreatePeriodoNominaDialog from '~/components/dialogs/create-periodo-nomina';
import RequiredLabel from '~/components/forms/required-label';
import HelpTooltip from '~/components/tooltips/help-tooltip';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { isRole } from '~/lib/auth';
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
  const primas = getAllPrimas();
  const result = await Promise.all([periodos, empleados, primas]);
  return {
    periodos: result[0],
    empleados: result[1],
    primasDisponibles: result[2],
  };
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
  const { periodos, empleados, primasDisponibles } =
    useLoaderData<typeof loader>();
  const primasEmpleadoFetcher =
    useFetcher<Awaited<ReturnType<typeof getAllPrimasForEmpleado>>>();

  const [showDialog, setShowDialog] = useState(false);

  const handleEmpleadoChange = (empleadoId: string) => {
    if (empleadoId) {
      primasEmpleadoFetcher.load(`/primas-empleado/${empleadoId}`);
    }
  };

  useEffect(() => {
    if (primasEmpleadoFetcher.data) {
      const { primaAcademica, primaAntiguedad, otrasPrimas } =
        primasEmpleadoFetcher.data;
      const fields = [
        { id: 'primaAcademica', value: primaAcademica },
        { id: 'primaAntiguedad', value: primaAntiguedad },
        ...otrasPrimas.map((prima) => ({
          id: prima.nombre,
          value: prima.monto,
        })),
      ];
      fields.forEach(({ id, value }) => {
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) {
          input.value = value.toString();
        }
      });
    }
  }, [primasEmpleadoFetcher.data]);

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4'>Cargar Pago de Nómina</h1>
      <CreatePeriodoNominaDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
      <Form method='post' className='space-y-3 w-1/2'>
        <div className='space-y-1'>
          <RequiredLabel htmlFor='periodoNominaId'>
            Seleccione un periodo de nómina
          </RequiredLabel>
          <div className='flex gap-3'>
            <Select name='periodoNominaId' required>
              <SelectTrigger id='periodoNominaId'>
                <SelectValue placeholder='Ejemplo: Enero 2024' />
              </SelectTrigger>
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
        </div>

        <div className='space-y-1'>
          <RequiredLabel htmlFor='empleadoId'>
            Seleccione un empleado
          </RequiredLabel>
          <Select
            name='empleadoId'
            required
            onValueChange={handleEmpleadoChange}
          >
            <SelectTrigger id='empleadoId'>
              <SelectValue placeholder='Seleccionar empleado' />
            </SelectTrigger>
            <SelectContent>
              {empleados.map((empleado) => (
                <SelectItem key={empleado.id} value={String(empleado.id)}>
                  {empleado.nombre} - {empleado.cedula}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1'>
          <RequiredLabel htmlFor='cargoEmpleado'>
            Tipo de empleado
          </RequiredLabel>
          <Input
            id='cargoEmpleado'
            name='cargoEmpleado'
            placeholder='Instructor, Obrero, Administrativo...'
            required
          />
        </div>

        <div className='space-y-1'>
          <RequiredLabel htmlFor='sueldoBaseMensual'>
            Sueldo base mensual
          </RequiredLabel>
          <Input
            id='sueldoBaseMensual'
            name='sueldoBaseMensual'
            type='number'
            step='0.01'
            placeholder='Ingresar sueldo'
            required
          />
        </div>

        <p className='text-lg font-semibold pt-2'>
          Asignaciones{' '}
          <HelpTooltip text='Montos generados en base al registro del empleado' />
        </p>
        <div className='space-y-1'>
          <RequiredLabel htmlFor='primaAntiguedad'>
            Prima de antigüedad
          </RequiredLabel>
          <Input
            id='primaAntiguedad'
            name='primaAntiguedad'
            type='number'
            step='0.01'
            placeholder='Ingresar prima'
            required
            disabled={primasEmpleadoFetcher.state === 'loading'}
          />
        </div>

        <div className='space-y-1'>
          <RequiredLabel htmlFor='primaAcademica'>
            Prima académica
          </RequiredLabel>
          <Input
            id='primaAcademica'
            name='primaAcademica'
            type='number'
            step='0.01'
            placeholder='Ingresar prima'
            required
            disabled={primasEmpleadoFetcher.state === 'loading'}
          />
        </div>

        {primasDisponibles
          .filter((prima) => prima.nombre.startsWith('Prima'))
          .sort((a, b) => {
            if (a.frecuencia === b.frecuencia) {
              return a.id - b.id;
            }
            return a.frecuencia === 'mensual' ? -1 : 1;
          })
          .map((prima) => (
            <div className='space-y-1' key={prima.id}>
              {prima.frecuencia === 'mensual' ? (
                <RequiredLabel htmlFor={prima.nombre}>
                  {prima.nombre}
                </RequiredLabel>
              ) : (
                <Label htmlFor={prima.nombre}>{prima.nombre}</Label>
              )}
              <Input
                id={prima.nombre}
                name={prima.nombre}
                type='number'
                step='0.01'
                placeholder='Ingresar prima'
                required={prima.frecuencia === 'mensual'}
                disabled={primasEmpleadoFetcher.state === 'loading'}
              />
            </div>
          ))}

        <p className='text-lg font-semibold pt-2'>
          Bonos adicionales{' '}
          <HelpTooltip text='Montos generados en base al registro del empleado' />
        </p>
        {primasDisponibles
          .sort((a, b) => {
            if (a.frecuencia === b.frecuencia) {
              return a.id - b.id;
            }
            return a.frecuencia === 'mensual' ? -1 : 1;
          })
          .filter((prima) => !prima.nombre.startsWith('Prima'))
          .map((prima) => (
            <div className='space-y-1' key={prima.nombre}>
              {prima.frecuencia === 'mensual' ? (
                <RequiredLabel htmlFor={prima.nombre}>
                  {prima.nombre}
                </RequiredLabel>
              ) : (
                <Label htmlFor={prima.nombre}>
                  {prima.nombre} (opcional, frecuencia anual)
                </Label>
              )}
              <Input
                id={prima.nombre}
                name={prima.nombre}
                type='number'
                step='0.01'
                placeholder='Ingresar prima'
                required={prima.frecuencia === 'mensual'}
                disabled={primasEmpleadoFetcher.state === 'loading'}
              />
            </div>
          ))}

        <p className='text-lg font-semibold pt-2'>
          Deducciones{' '}
          <HelpTooltip text='Montos generados en base al registro del empleado' />
        </p>
        <div className='space-y-1'>
          <RequiredLabel htmlFor='leyPoliticaHabitacionalFaov'>
            Deducción Ley Política Habitacional FAOV
          </RequiredLabel>
          <Input
            id='leyPoliticaHabitacionalFaov'
            name='leyPoliticaHabitacionalFaov'
            type='number'
            step='0.01'
            placeholder='Ingresar deducción'
            required
          />
        </div>

        <div className='space-y-1'>
          <RequiredLabel htmlFor='descuentoSso'>Deducción SSO</RequiredLabel>
          <Input
            id='descuentoSso'
            name='descuentoSso'
            type='number'
            step='0.01'
            placeholder='Ingresar deducción'
            required
          />
        </div>

        <div className='space-y-1'>
          <RequiredLabel htmlFor='descuentoSpf'>Deducción SPF</RequiredLabel>
          <Input
            id='descuentoSpf'
            name='descuentoSpf'
            type='number'
            step='0.01'
            placeholder='Ingresar deducción'
            required
          />
        </div>

        <Button className='link-button w-full' type='submit'>
          Guardar pago
        </Button>
      </Form>
    </div>
  );
}
