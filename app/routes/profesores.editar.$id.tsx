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
  extractEmpleadoPersonalData,
  extractEmpleadoPositionData,
  extractEmpleadoProfessionalData,
} from '~/lib/formData';
import { EmpleadoUpdate } from '~/types/empleados.types';
import { getProfesorById, updateProfesor } from '~/api/controllers/profesores';
import { isRole } from '~/lib/auth';
import TabbedEmpleadoForm from '~/components/forms/tabbed-empleado-form';
import { getTitulos } from '~/api/controllers/titulos.server';
import { getNiveles } from '~/api/controllers/niveles.server';
import { getCargos } from '~/api/controllers/cargos.server';
import { getGrados } from '~/api/controllers/grados.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Modificar Profesor | San Martín de Porres' },
    { name: 'description', content: 'Modifica un profesor en el sistema' },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }

  const profesor = getProfesorById(Number(params.id));
  const titulos = getTitulos();
  const niveles = getNiveles();
  const cargos = getCargos();
  const grados = getGrados();
  const result = await Promise.all([
    profesor,
    titulos,
    niveles,
    cargos,
    grados,
  ]);
  if ('type' in result[0]) {
    return redirect('/profesores');
  }
  return result;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get('profesorId');
  if (!id) {
    return json({
      type: 'error',
      message: 'Indique el profesor a editar',
    });
  }
  const step = formData.get('step');
  if (!step) {
    return json({
      type: 'error',
      message: 'Indique la sección del profesor a editar',
    });
  }
  let data: EmpleadoUpdate = {};
  if (Number(step) === 1) data = extractEmpleadoPersonalData(formData);
  if (Number(step) === 2) data = extractEmpleadoProfessionalData(formData);
  if (Number(step) === 3) data = extractEmpleadoPositionData(formData);
  const response = await updateProfesor(Number(id), data);
  return json(response);
};

function getDateForDefaultValue(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function EditarProfesor() {
  const [profesor, titulos, niveles, cargos, grados] =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  if ('type' in profesor) return null;

  return (
    <>
      <Link
        to='/profesores'
        className='text-sm text-gray-500 hover:underline inline-flex items-center'
      >
        <ChevronLeft />
        Volver
      </Link>
      <h1 className='text-xl font-bold mb-3'>Editar Profesor</h1>
      <span className='text-destructive text-sm'>(*) Obligatorio</span>
      <TabbedEmpleadoForm
        fetcher={fetcher}
        empleadoId={profesor.id}
        formOneDefault={{
          cedula: profesor.cedula,
          nombreCompleto: profesor.nombreCompleto,
          fechaNacimiento: getDateForDefaultValue(profesor.fechaNacimiento),
          sexo: profesor.sexo,
          estadoCivil: profesor.estadoCivil,
          religion: profesor.religion,
          cantidadHijos: profesor.cantidadHijos,
          hijosMenoresSeis: profesor.hijosMenoresSeis,
        }}
        formTwoDefault={{
          fechaIngresoAvec: getDateForDefaultValue(profesor.fechaIngresoAvec),
          fechaIngresoPlantel: getDateForDefaultValue(
            profesor.fechaIngresoPlantel,
          ),
          titulo: profesor.titulo,
          descripcionTitulo: profesor.descripcionTitulo || '',
          mencionTitulo: profesor.mencionTitulo || '',
          carreraEstudiando: profesor.carreraEstudiando || '',
          tipoLapsoEstudios: profesor.tipoLapsoEstudios || '',
          numeroLapsosAprobados: profesor.numeroLapsosAprobados || 0,
          postgrado: profesor.postgrado || '',
          experienciaLaboral: profesor.experienciaLaboral,
        }}
        formThreeDefault={{
          gradoSistema: profesor.gradoSistema,
          nivelSistema: profesor.nivelSistema,
          gradoCentro: profesor.gradoCentro,
          nivelCentro: profesor.nivelCentro,
          cargo: profesor.cargo,
          horasSemanales: profesor.horasSemanales,
          sueldo: profesor.sueldo,
          asignacionesMensual: profesor.asignacionesMensual,
          deduccionesMensual: profesor.deduccionesMensual,
          primaAntiguedad: profesor.primaAntiguedad,
          primaGeografica: profesor.primaGeografica,
          primaCompensacionAcademica: profesor.primaCompensacionAcademica,
          primaAsistencial: profesor.primaAsistencial,
          contribucionDiscapacidad: profesor.contribucionDiscapacidad,
          contribucionDiscapacidadHijos: profesor.contribucionDiscapacidadHijos,
          porcentajeSso: profesor.porcentajeSso,
          porcentajeRpe: profesor.porcentajeRpe,
          porcentajeFaov: profesor.porcentajeFaov,
          pagoDirecto: profesor.pagoDirecto,
          jubilado: profesor.jubilado,
          cuentaBancaria: profesor.cuentaBancaria,
          observaciones: profesor.observaciones || '',
        }}
        titulos={titulos}
        niveles={niveles}
        cargos={cargos}
        grados={grados}
      />
    </>
  );
}
