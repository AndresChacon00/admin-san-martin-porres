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

  const empleado = await getEmpleadoById(Number(params.id));
  if ('type' in empleado) {
    return redirect('/empleados');
  }
  return empleado;
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
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

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
        empleadoId={loaderData.id}
        formOneDefault={{
          cedula: loaderData.cedula,
          nombreCompleto: loaderData.nombreCompleto,
          fechaNacimiento: getDateForDefaultValue(loaderData.fechaNacimiento),
          sexo: loaderData.sexo,
          estadoCivil: loaderData.estadoCivil,
          religion: loaderData.religion,
          cantidadHijos: loaderData.cantidadHijos,
          hijosMenoresSeis: loaderData.hijosMenoresSeis,
        }}
        formTwoDefault={{
          fechaIngresoAvec: getDateForDefaultValue(loaderData.fechaIngresoAvec),
          fechaIngresoPlantel: getDateForDefaultValue(
            loaderData.fechaIngresoPlantel,
          ),
          titulo: loaderData.titulo,
          descripcionTitulo: loaderData.descripcionTitulo || '',
          mencionTitulo: loaderData.mencionTitulo || '',
          carreraEstudiando: loaderData.carreraEstudiando || '',
          tipoLapsoEstudios: loaderData.tipoLapsoEstudios || '',
          numeroLapsosAprobados: loaderData.numeroLapsosAprobados || 0,
          postgrado: loaderData.postgrado || '',
          experienciaLaboral: loaderData.experienciaLaboral,
        }}
        formThreeDefault={{
          gradoSistema: loaderData.gradoSistema,
          nivelSistema: loaderData.nivelSistema,
          gradoCentro: loaderData.gradoCentro,
          nivelCentro: loaderData.nivelCentro,
          cargo: loaderData.cargo,
          horasSemanales: loaderData.horasSemanales,
          sueldo: loaderData.sueldo,
          asignacionesMensual: loaderData.asignacionesMensual,
          deduccionesMensual: loaderData.deduccionesMensual,
          primaAntiguedad: loaderData.primaAntiguedad,
          primaGeografica: loaderData.primaGeografica,
          primaCompensacionAcademica: loaderData.primaCompensacionAcademica,
          primaAsistencial: loaderData.primaAsistencial,
          contribucionDiscapacidad: loaderData.contribucionDiscapacidad,
          contribucionDiscapacidadHijos:
            loaderData.contribucionDiscapacidadHijos,
          porcentajeSso: loaderData.porcentajeSso,
          porcentajeRpe: loaderData.porcentajeRpe,
          porcentajeFaov: loaderData.porcentajeFaov,
          pagoDirecto: loaderData.pagoDirecto,
          jubilado: loaderData.jubilado,
          cuentaBancaria: loaderData.cuentaBancaria,
          observaciones: loaderData.observaciones || '',
        }}
      />
    </>
  );
}
