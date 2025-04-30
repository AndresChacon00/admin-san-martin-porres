import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node';
import {
  json,
  Link,
  redirect,
  useFetcher,
  useLoaderData,
} from '@remix-run/react';
import { ChevronLeft } from 'lucide-react';
import {
  getEmpleadoById,
  updateEmpleado,
} from '~/api/controllers/empleados.server';
import {
  extractEmpleadoPersonalData,
  extractEmpleadoPositionData,
  extractEmpleadoProfessionalData,
} from '~/lib/formData';
import type { EmpleadoUpdate } from '~/types/empleados.types';
import { isRole } from '~/lib/auth';
import TabbedEmpleadoForm from '~/components/forms/tabbed-empleado-form';
import { getTitulos } from '~/api/controllers/titulos.server';
import { getNiveles } from '~/api/controllers/niveles.server';
import { getGrados } from '~/api/controllers/grados.server';
import { getCargos } from '~/api/controllers/cargos.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Modificar Empleado | San Martín de Porres' },
    { name: 'description', content: 'Modifica un empleado en el sistema' },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }

  const empleado = getEmpleadoById(Number(params.id));
  const titulos = getTitulos();
  const niveles = getNiveles();
  const cargos = getCargos();
  const grados = getGrados();
  const result = await Promise.all([
    empleado,
    titulos,
    niveles,
    cargos,
    grados,
  ]);
  if ('type' in result[0]) {
    return redirect('/empleados');
  }
  return result;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get('empleadoId');
  if (!id) {
    return json({
      type: 'error',
      message: 'Indique el empleado a editar',
    });
  }
  const step = formData.get('step');
  if (!step) {
    return json({
      type: 'error',
      message: 'Indique la sección del empleado a editar',
    });
  }
  let data: EmpleadoUpdate = {};
  if (Number(step) === 1) data = extractEmpleadoPersonalData(formData);
  if (Number(step) === 2) data = extractEmpleadoProfessionalData(formData);
  if (Number(step) === 3) data = extractEmpleadoPositionData(formData);
  const response = await updateEmpleado(Number(id), data);
  return json(response);
};

function getDateForDefaultValue(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function EditarEmpleado() {
  const [empleado, titulos, niveles, cargos, grados] =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  if ('type' in empleado) return null;

  return (
    <>
      <Link
        to='/empleados'
        className='text-sm text-gray-500 hover:underline inline-flex items-center'
      >
        <ChevronLeft />
        Volver
      </Link>
      <h1 className='text-xl font-bold mb-3'>Editar Empleado</h1>
      <span className='text-destructive text-sm'>(*) Obligatorio</span>
      <TabbedEmpleadoForm
        fetcher={fetcher}
        empleadoId={empleado.id}
        formOneDefault={{
          cedula: empleado.cedula,
          nombreCompleto: empleado.nombreCompleto,
          fechaNacimiento: getDateForDefaultValue(empleado.fechaNacimiento),
          sexo: empleado.sexo,
          estadoCivil: empleado.estadoCivil,
          religion: empleado.religion,
          cantidadHijos: empleado.cantidadHijos,
          hijosMenoresSeis: empleado.hijosMenoresSeis,
        }}
        formTwoDefault={{
          fechaIngresoAvec: getDateForDefaultValue(empleado.fechaIngresoAvec),
          fechaIngresoPlantel: getDateForDefaultValue(
            empleado.fechaIngresoPlantel,
          ),
          titulo: empleado.titulo,
          descripcionTitulo: empleado.descripcionTitulo || '',
          mencionTitulo: empleado.mencionTitulo || '',
          carreraEstudiando: empleado.carreraEstudiando || '',
          tipoLapsoEstudios: empleado.tipoLapsoEstudios || '',
          numeroLapsosAprobados: empleado.numeroLapsosAprobados || 0,
          postgrado: empleado.postgrado || '',
          experienciaLaboral: empleado.experienciaLaboral,
        }}
        formThreeDefault={{
          gradoSistema: empleado.gradoSistema,
          nivelSistema: empleado.nivelSistema,
          gradoCentro: empleado.gradoCentro,
          nivelCentro: empleado.nivelCentro,
          cargo: empleado.cargo,
          horasSemanales: empleado.horasSemanales,
          sueldo: empleado.sueldo,
          contribucionDiscapacidad: empleado.contribucionDiscapacidad,
          contribucionDiscapacidadHijos: empleado.contribucionDiscapacidadHijos,
          pagoDirecto: empleado.pagoDirecto,
          jubilado: empleado.jubilado,
          cuentaBancaria: empleado.cuentaBancaria,
          observaciones: empleado.observaciones || '',
        }}
        titulos={titulos}
        cargos={cargos}
        niveles={niveles}
        grados={grados}
      />
    </>
  );
}
