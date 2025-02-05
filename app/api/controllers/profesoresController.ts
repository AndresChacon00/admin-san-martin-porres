import db from '../db';
import { profesores } from '../tables/profesores';
import { empleados } from '../tables/empleados';

export const getProfesores = async () => {
  try {
    const profesoresList = await db
      .select()
      .from(profesores)
      .orderBy(profesores.id);

    return profesoresList;
  } catch (error) {
    console.error('Error al obtener a los profesores: ', error);
  }
};

export const addProfesor = async (
  cedula: string,
  nombreCompleto: string,
  fechaNacimiento: number,
  sexo: string,
  estadoCivil: string,
  religion: string,
  hijosMenoresSeis: number,
  montoMensualGuarderia: number,
  fechaIngresoAvec: number,
  fechaIngresoPlantel: number,
  titulo: string,
  descripcionTitulo: string,
  mencionTitulo: string,
  carreraEstudiando: string,
  tipoLapsoEstudios: string,
  numeroLapsosAprobados: number,
  postgrado: string,
  experienciaLaboral: number,
  gradoSistema: string,
  nivelSistema: string,
  gradoCentro: string,
  nivelCentro: string,
  cargo: string,
  horasSemanales: number,
  sueldo: number,
  asignacionesMensual: number,
  deduccionesMensual: number,
  primaAntiguedad: number,
  primaGeografica: number,
  primaCompensacionAcademica: number,
  cantidadHijos: number,
  primaAsistencial: number,
  contribucionDiscapacidad: number,
  contribucionDiscapacidadHijos: number,
  porcentajeSso: number,
  porcentajeRpe: number,
  porcentajeFaov: number,
  pagoDirecto: boolean,
  jubilado: boolean,
  cuentaBancaria: string,
  observaciones: string
) => {
  try {
    const newEmpleado = await db
      .insert(empleados)
      .values({
        cedula,
        nombreCompleto,
        fechaNacimiento,
        sexo,
        estadoCivil,
        religion,
        hijosMenoresSeis,
        montoMensualGuarderia,
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
        cantidadHijos,
        primaAsistencial,
        contribucionDiscapacidad,
        contribucionDiscapacidadHijos,
        porcentajeSso,
        porcentajeRpe,
        porcentajeFaov,
        pagoDirecto,
        jubilado,
        cuentaBancaria,
        observaciones
      })
      .returning();

    const newProfesor = await db
      .insert(profesores)
      .values({ id: newEmpleado[0].id })
      .returning();

    return newProfesor[0];
  } catch (error) {
    console.error('Error al añadir un profesor: ', error);
  }
};