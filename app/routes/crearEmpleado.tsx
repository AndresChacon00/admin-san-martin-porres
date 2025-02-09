import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import {
  addEmpleado,
  getEmpleados,
} from '../api/controllers/empleados.server';
import { empleados } from '../api/tables/empleados';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader: LoaderFunction = async () => {
  const empleados = await getEmpleados();
  return empleados;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const cedula = formData.get('cedula');
  const nombreCompleto = formData.get('nombreCompleto');
  const fechaNacimiento = new Date(formData.get('fechaNacimiento') as string);
  const sexo = formData.get('sexo') as "F" | "M";
  const estadoCivil = formData.get('estadoCivil') as "S" | "C" | "D" | "V" | "R";
  const religion = formData.get('religion');
  const hijosMenoresSeis = formData.get('hijosMenoresSeis');
  const montoMensualGuarderia = formData.get('montoMensualGuarderia');
  const fechaIngresoAvec = new Date(formData.get('fechaIngresoAvec') as string);
  const fechaIngresoPlantel = new Date(formData.get('fechaIngresoPlantel') as string);
  const titulo = formData.get('titulo');
  const descripcionTitulo = formData.get('descripcionTitulo');
  const mencionTitulo = formData.get('mencionTitulo');
  const carreraEstudiando = formData.get('carreraEstudiando');
  const tipoLapsoEstudios = formData.get('tipoLapsoEstudios');
  const numeroLapsosAprobados = formData.get('numeroLapsosAprobados');
  const postgrado = formData.get('postgrado');
  const experienciaLaboral = formData.get('experienciaLaboral');
  const gradoSistema = formData.get('gradoSistema');
  const nivelSistema = formData.get('nivelSistema');
  const gradoCentro = formData.get('gradoCentro');
  const nivelCentro = formData.get('nivelCentro');
  const cargo = formData.get('cargo');
  const horasSemanales = formData.get('horasSemanales');
  const sueldo = formData.get('sueldo');
  const asignacionesMensual = formData.get('asignacionesMensual');
  const deduccionesMensual = formData.get('deduccionesMensual');
  const primaAntiguedad = formData.get('primaAntiguedad');
  const primaGeografica = formData.get('primaGeografica');
  const primaCompensacionAcademica = formData.get('primaCompensacionAcademica');
  const cantidadHijos = formData.get('cantidadHijos');
  const primaAsistencial = formData.get('primaAsistencial');
  const contribucionDiscapacidad = formData.get('contribucionDiscapacidad');
  const contribucionDiscapacidadHijos = formData.get('contribucionDiscapacidadHijos');
  const porcentajeSso = formData.get('porcentajeSso');
  const porcentajeRpe = formData.get('porcentajeRpe');
  const porcentajeFaov = formData.get('porcentajeFaov');
  const pagoDirecto = formData.get('pagoDirecto');
  const jubilado = formData.get('jubilado');
  const cuentaBancaria = formData.get('cuentaBancaria');
  const observaciones = formData.get('observaciones');

  if (
    typeof cedula !== 'string' ||
    typeof nombreCompleto !== 'string' ||
    typeof fechaNacimiento !== 'string' ||
    typeof sexo !== 'string' ||
    typeof estadoCivil !== 'string' ||
    typeof religion !== 'string' ||
    typeof hijosMenoresSeis !== 'string' ||
    typeof montoMensualGuarderia !== 'string' ||
    typeof fechaIngresoAvec !== 'string' ||
    typeof fechaIngresoPlantel !== 'string' ||
    typeof titulo !== 'string' ||
    typeof descripcionTitulo !== 'string' ||
    typeof mencionTitulo !== 'string' ||
    typeof carreraEstudiando !== 'string' ||
    typeof tipoLapsoEstudios !== 'string' ||
    typeof numeroLapsosAprobados !== 'string' ||
    typeof postgrado !== 'string' ||
    typeof experienciaLaboral !== 'string' ||
    typeof gradoSistema !== 'string' ||
    typeof nivelSistema !== 'string' ||
    typeof gradoCentro !== 'string' ||
    typeof nivelCentro !== 'string' ||
    typeof cargo !== 'string' ||
    typeof horasSemanales !== 'string' ||
    typeof sueldo !== 'string' ||
    typeof asignacionesMensual !== 'string' ||
    typeof deduccionesMensual !== 'string' ||
    typeof primaAntiguedad !== 'string' ||
    typeof primaGeografica !== 'string' ||
    typeof primaCompensacionAcademica !== 'string' ||
    typeof cantidadHijos !== 'string' ||
    typeof primaAsistencial !== 'string' ||
    typeof contribucionDiscapacidad !== 'string' ||
    typeof contribucionDiscapacidadHijos !== 'string' ||
    typeof porcentajeSso !== 'string' ||
    typeof porcentajeRpe !== 'string' ||
    typeof porcentajeFaov !== 'string' ||
    typeof pagoDirecto !== 'string' ||
    typeof jubilado !== 'string' ||
    typeof cuentaBancaria !== 'string' ||
    typeof observaciones !== 'string'
  ) {
    return { error: 'Invalid form data' };
  }

  await addEmpleado({
    cedula,
    nombreCompleto,
    fechaNacimiento,
    sexo,
    estadoCivil,
    religion,
    hijosMenoresSeis: Number(hijosMenoresSeis),
    montoMensualGuarderia: Number(montoMensualGuarderia),
    fechaIngresoAvec,
    fechaIngresoPlantel,
    titulo,
    descripcionTitulo,
    mencionTitulo,
    carreraEstudiando,
    tipoLapsoEstudios,
    numeroLapsosAprobados: Number(numeroLapsosAprobados),
    postgrado,
    experienciaLaboral: Number(experienciaLaboral),
    gradoSistema,
    nivelSistema,
    gradoCentro,
    nivelCentro,
    cargo,
    horasSemanales: Number(horasSemanales),
    sueldo: Number(sueldo),
    asignacionesMensual: Number(asignacionesMensual),
    deduccionesMensual: Number(deduccionesMensual),
    primaAntiguedad: Number(primaAntiguedad),
    primaGeografica: Number(primaGeografica),
    primaCompensacionAcademica: Number(primaCompensacionAcademica),
    cantidadHijos: Number(cantidadHijos),
    primaAsistencial: Number(primaAsistencial),
    contribucionDiscapacidad: Number(contribucionDiscapacidad),
    contribucionDiscapacidadHijos: Number(contribucionDiscapacidadHijos),
    porcentajeSso: Number(porcentajeSso),
    porcentajeRpe: Number(porcentajeRpe),
    porcentajeFaov: Number(porcentajeFaov),
    pagoDirecto: pagoDirecto === 'on',
    jubilado: jubilado === 'on',
    cuentaBancaria,
    observaciones,
  });

  return null;
};

export default function CrearEmpleado() {
  const empleados = useLoaderData<any[]>();
  const actionData = useActionData<{ error?: string }>();
  return (
    <div>      
      <h1>San Martin de Porres</h1>
      <h1 className='text-xl font-bold'>Empleado</h1>
      <h2>Agregar Empleado</h2>
      <Form method='post'>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Cedula:
            <Input type='text' name='cedula' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Nombre Completo:
            <Input type='text' name='nombreCompleto' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Fecha de Nacimiento:
            <Input type='date' name='fechaNacimiento' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Sexo:
            <Input type='text' name='sexo' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Estado Civil:
            <Input type='text' name='estadoCivil' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Religion:
            <Input type='text' name='religion' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Hijos Menores de Seis:
            <Input type='number' name='hijosMenoresSeis' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Monto Mensual Guarderia:
            <Input type='number' name='montoMensualGuarderia' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Fecha de Ingreso AVEC:
            <Input type='date' name='fechaIngresoAvec' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Fecha de Ingreso Plantel:
            <Input type='date' name='fechaIngresoPlantel' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Titulo:
            <Input type='text' name='titulo' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Descripcion del Titulo:
            <Input type='text' name='descripcionTitulo' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Mencion del Titulo:
            <Input type='text' name='mencionTitulo' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Carrera Estudiando:
            <Input type='text' name='carreraEstudiando' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Tipo de Lapso de Estudios:
            <Input type='text' name='tipoLapsoEstudios' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Numero de Lapsos Aprobados:
            <Input type='number' name='numeroLapsosAprobados' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Postgrado:
            <Input type='text' name='postgrado' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Experiencia Laboral:
            <Input type='number' name='experienciaLaboral' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Grado en el Sistema:
            <Input type='text' name='gradoSistema' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Nivel en el Sistema:
            <Input type='text' name='nivelSistema' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Grado en el Centro:
            <Input type='text' name='gradoCentro' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Nivel en el Centro:
            <Input type='text' name='nivelCentro' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Cargo:
            <Input type='text' name='cargo' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Horas Semanales:
            <Input type='number' name='horasSemanales' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Sueldo:
            <Input type='number' name='sueldo' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Asignaciones Mensuales:
            <Input type='number' name='asignacionesMensual' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Deducciones Mensuales:
            <Input type='number' name='deduccionesMensual' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Prima de Antigüedad:
            <Input type='number' name='primaAntiguedad' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Prima Geográfica:
            <Input type='number' name='primaGeografica' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Prima de Compensación Académica:
            <Input type='number' name='primaCompensacionAcademica' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Cantidad de Hijos:
            <Input type='number' name='cantidadHijos' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Prima Asistencial:
            <Input type='number' name='primaAsistencial' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Contribución por Discapacidad:
            <Input type='number' name='contribucionDiscapacidad' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Contribución por Discapacidad de Hijos:
            <Input type='number' name='contribucionDiscapacidadHijos' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Porcentaje SSO:
            <Input type='number' name='porcentajeSso' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Porcentaje RPE:
            <Input type='number' name='porcentajeRpe' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Porcentaje FAOV:
            <Input type='number' name='porcentajeFaov' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Pago Directo:
            <Input type='checkbox' name='pagoDirecto' />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Jubilado:
            <Input type='checkbox' name='jubilado' />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Cuenta Bancaria:
            <Input type='text' name='cuentaBancaria' required />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Observaciones:
            <Input as='textarea' name='observaciones' />
          </label>
        </div>
        {actionData?.error && <p>{actionData.error}</p>}
        <Button
          type='submit'
        >
          Agregar
        </Button>
      </Form>
    </div>
  );
}