import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import {
  addEmpleado,
  getEmpleados,
} from '../api/controllers/empleados';
import { empleados } from '../api/tables/empleados';
import Button from '../components/Button';

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
      <Button/>
      <h1>San Martin de Porres</h1>
      <h2>Empleados</h2>
      <ul>
        {empleados.map((empleado) => (
          <li key={empleado.id}>
            {empleado.nombreCompleto} ({empleado.cedula})
          </li>
        ))}
      </ul>

      <h2>Agregar Empleado</h2>
      <Form method='post'>
        <div>
          <label>
            Cedula:
            <input type='text' name='cedula' required />
          </label>
        </div>
        <div>
          <label>
            Nombre Completo:
            <input type='text' name='nombreCompleto' required />
          </label>
        </div>
        <div>
          <label>
            Fecha de Nacimiento:
            <input type='date' name='fechaNacimiento' required />
          </label>
        </div>
        <div>
          <label>
            Sexo:
            <input type='text' name='sexo' required />
          </label>
        </div>
        <div>
          <label>
            Estado Civil:
            <input type='text' name='estadoCivil' required />
          </label>
        </div>
        <div>
          <label>
            Religion:
            <input type='text' name='religion' required />
          </label>
        </div>
        <div>
          <label>
            Hijos Menores de Seis:
            <input type='number' name='hijosMenoresSeis' required />
          </label>
        </div>
        <div>
          <label>
            Monto Mensual Guarderia:
            <input type='number' name='montoMensualGuarderia' required />
          </label>
        </div>
        <div>
          <label>
            Fecha de Ingreso AVEC:
            <input type='date' name='fechaIngresoAvec' required />
          </label>
        </div>
        <div>
          <label>
            Fecha de Ingreso Plantel:
            <input type='date' name='fechaIngresoPlantel' required />
          </label>
        </div>
        <div>
          <label>
            Titulo:
            <input type='text' name='titulo' required />
          </label>
        </div>
        <div>
          <label>
            Descripcion del Titulo:
            <input type='text' name='descripcionTitulo' required />
          </label>
        </div>
        <div>
          <label>
            Mencion del Titulo:
            <input type='text' name='mencionTitulo' required />
          </label>
        </div>
        <div>
          <label>
            Carrera Estudiando:
            <input type='text' name='carreraEstudiando' required />
          </label>
        </div>
        <div>
          <label>
            Tipo de Lapso de Estudios:
            <input type='text' name='tipoLapsoEstudios' required />
          </label>
        </div>
        <div>
          <label>
            Numero de Lapsos Aprobados:
            <input type='number' name='numeroLapsosAprobados' required />
          </label>
        </div>
        <div>
          <label>
            Postgrado:
            <input type='text' name='postgrado' required />
          </label>
        </div>
        <div>
          <label>
            Experiencia Laboral:
            <input type='number' name='experienciaLaboral' required />
          </label>
        </div>
        <div>
          <label>
            Grado en el Sistema:
            <input type='text' name='gradoSistema' required />
          </label>
        </div>
        <div>
          <label>
            Nivel en el Sistema:
            <input type='text' name='nivelSistema' required />
          </label>
        </div>
        <div>
          <label>
            Grado en el Centro:
            <input type='text' name='gradoCentro' required />
          </label>
        </div>
        <div>
          <label>
            Nivel en el Centro:
            <input type='text' name='nivelCentro' required />
          </label>
        </div>
        <div>
          <label>
            Cargo:
            <input type='text' name='cargo' required />
          </label>
        </div>
        <div>
          <label>
            Horas Semanales:
            <input type='number' name='horasSemanales' required />
          </label>
        </div>
        <div>
          <label>
            Sueldo:
            <input type='number' name='sueldo' required />
          </label>
        </div>
        <div>
          <label>
            Asignaciones Mensuales:
            <input type='number' name='asignacionesMensual' required />
          </label>
        </div>
        <div>
          <label>
            Deducciones Mensuales:
            <input type='number' name='deduccionesMensual' required />
          </label>
        </div>
        <div>
          <label>
            Prima de Antigüedad:
            <input type='number' name='primaAntiguedad' required />
          </label>
        </div>
        <div>
          <label>
            Prima Geográfica:
            <input type='number' name='primaGeografica' required />
          </label>
        </div>
        <div>
          <label>
            Prima de Compensación Académica:
            <input type='number' name='primaCompensacionAcademica' required />
          </label>
        </div>
        <div>
          <label>
            Cantidad de Hijos:
            <input type='number' name='cantidadHijos' required />
          </label>
        </div>
        <div>
          <label>
            Prima Asistencial:
            <input type='number' name='primaAsistencial' required />
          </label>
        </div>
        <div>
          <label>
            Contribución por Discapacidad:
            <input type='number' name='contribucionDiscapacidad' required />
          </label>
        </div>
        <div>
          <label>
            Contribución por Discapacidad de Hijos:
            <input type='number' name='contribucionDiscapacidadHijos' required />
          </label>
        </div>
        <div>
          <label>
            Porcentaje SSO:
            <input type='number' name='porcentajeSso' required />
          </label>
        </div>
        <div>
          <label>
            Porcentaje RPE:
            <input type='number' name='porcentajeRpe' required />
          </label>
        </div>
        <div>
          <label>
            Porcentaje FAOV:
            <input type='number' name='porcentajeFaov' required />
          </label>
        </div>
        <div>
          <label>
            Pago Directo:
            <input type='checkbox' name='pagoDirecto' />
          </label>
        </div>
        <div>
          <label>
            Jubilado:
            <input type='checkbox' name='jubilado' />
          </label>
        </div>
        <div>
          <label>
            Cuenta Bancaria:
            <input type='text' name='cuentaBancaria' required />
          </label>
        </div>
        <div>
          <label>
            Observaciones:
            <textarea name='observaciones' />
          </label>
        </div>
        {actionData?.error && <p>{actionData.error}</p>}
        <button type='submit'>Agregar Empleado</button>
      </Form>
    </div>
  );
}