import { EstadoCivil, Sexo } from '~/types/empleados.types';

/**
 * Extracts employee data into an object from a `FormData` instance
 * @author gabrielm
 * @param formData
 */
export function extractEmpleadoFormData(formData: FormData) {
  const cedula = String(formData.get('cedula'));
  const nombreCompleto = String(formData.get('nombreCompleto'));
  const fechaNacimiento = new Date(String(formData.get('fechaNacimiento')));
  const sexo = String(formData.get('sexo')) as Sexo;
  const estadoCivil = String(formData.get('estadoCivil')) as EstadoCivil;
  const religion = String(formData.get('religion'));
  const cantidadHijos = Number(formData.get('cantidadHijos'));
  const hijosMenoresSeis = Number(formData.get('hijosMenoresSeis'));
  const fechaIngresoAvec = new Date(String(formData.get('fechaIngresoAvec')));
  const fechaIngresoPlantel = new Date(
    String(formData.get('fechaIngresoPlantel')),
  );
  const titulo = String(formData.get('titulo') ?? '');
  const descripcionTitulo = String(formData.get('descripcionTitulo') ?? '');
  const mencionTitulo = String(formData.get('mencionTitulo') ?? '');
  const carreraEstudiando = String(formData.get('carreraEstudiando') ?? '');
  const tipoLapsoEstudios = String(formData.get('tipoLapsoEstudios') ?? '');
  const numeroLapsosAprobados = Number(
    formData.get('numeroLapsosAprobados') ?? 0,
  );
  const postgrado = String(formData.get('postgrado') ?? '');
  const experienciaLaboral = Number(formData.get('experienciaLaboral'));
  const gradoSistema = String(formData.get('gradoSistema') ?? '');
  const nivelSistema = String(formData.get('nivelSistema') ?? '');
  const gradoCentro = String(formData.get('gradoCentro') ?? '');
  const nivelCentro = String(formData.get('nivelCentro') ?? '');
  const cargo = String(formData.get('cargo') ?? '');
  const horasSemanales = Number(formData.get('horasSemanales'));
  const sueldo = Number(formData.get('sueldo'));
  const asignacionesMensual = Number(formData.get('asignacionesMensual'));
  const deduccionesMensual = Number(formData.get('deduccionesMensual'));
  const primaAntiguedad = Number(formData.get('primaAntiguedad'));
  const primaGeografica = Number(formData.get('primaGeografica'));
  const primaCompensacionAcademica = Number(
    formData.get('primaCompensacionAcademica'),
  );
  const primaAsistencial = Number(formData.get('primaAsistencial'));
  const contribucionDiscapacidad = Number(
    formData.get('contribucionDiscapacidad'),
  );
  const contribucionDiscapacidadHijos = Number(
    formData.get('contribucionDiscapacidadHijos'),
  );
  const porcentajeSso = Number(formData.get('porcentajeSso'));
  const porcentajeRpe = Number(formData.get('porcentajeRpe'));
  const porcentajeFaov = Number(formData.get('porcentajeFaov'));
  const pagoDirecto = String(formData.get('pagoDirecto')) === 'true';
  const jubilado = String(formData.get('jubilado')) === 'true';
  const cuentaBancaria = String(formData.get('cuentaBancaria') ?? '');
  const observaciones = String(formData.get('observaciones') ?? '');

  return {
    cedula,
    nombreCompleto,
    fechaNacimiento,
    sexo,
    estadoCivil,
    religion,
    cantidadHijos,
    hijosMenoresSeis,
    fechaIngresoAvec,
    fechaIngresoPlantel,
    titulo,
    descripcionTitulo,
    mencionTitulo,
    carreraEstudiando,
    tipoLapsoEstudios,
    numeroLapsosAprobados,
    postgrado,
    experienciaLaboral,
    gradoSistema,
    nivelSistema,
    gradoCentro,
    nivelCentro,
    cargo,
    horasSemanales,
    sueldo,
    asignacionesMensual,
    deduccionesMensual,
    primaAntiguedad,
    primaGeografica,
    primaCompensacionAcademica,
    primaAsistencial,
    contribucionDiscapacidad,
    contribucionDiscapacidadHijos,
    porcentajeSso,
    porcentajeRpe,
    porcentajeFaov,
    pagoDirecto,
    jubilado,
    cuentaBancaria,
    observaciones,
  };
}
