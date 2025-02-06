import db from '../db';
import { profesores } from '../tables/profesores';
import { empleados } from '../tables/empleados';
import { EmpleadoInsert } from '~/types/empleados.types';

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

export const addProfesor = async (data: EmpleadoInsert) => {
  try {
    const newEmpleado = await db
      .insert(empleados)
      .values({
        cedula: data.cedula,
        nombreCompleto: data.nombreCompleto,
        fechaNacimiento: data.fechaNacimiento,
        sexo: data.sexo,
        estadoCivil: data.estadoCivil,
        religion: data.religion,
        hijosMenoresSeis: data.hijosMenoresSeis,
        montoMensualGuarderia: data.montoMensualGuarderia,
        fechaIngresoAvec: data.fechaIngresoAvec,
        fechaIngresoPlantel: data.fechaIngresoPlantel,
        titulo: data.titulo,
        descripcionTitulo: data.descripcionTitulo,
        mencionTitulo: data.mencionTitulo,
        carreraEstudiando: data.carreraEstudiando,
        tipoLapsoEstudios: data.tipoLapsoEstudios,
        numeroLapsosAprobados: data.numeroLapsosAprobados,
        postgrado: data.postgrado,
        experienciaLaboral: data.experienciaLaboral,
        gradoSistema: data.gradoSistema,
        nivelSistema: data.nivelSistema,
        gradoCentro: data.gradoCentro,
        nivelCentro: data.nivelCentro,
        cargo: data.cargo,
        horasSemanales: data.horasSemanales,
        sueldo: data.sueldo,
        asignacionesMensual: data.asignacionesMensual,
        deduccionesMensual: data.deduccionesMensual,
        primaAntiguedad: data.primaAntiguedad,
        primaGeografica: data.primaGeografica,
        primaCompensacionAcademica: data.primaCompensacionAcademica,
        cantidadHijos: data.cantidadHijos,
        primaAsistencial: data.primaAsistencial,
        contribucionDiscapacidad: data.contribucionDiscapacidad,
        contribucionDiscapacidadHijos: data.contribucionDiscapacidadHijos,
        porcentajeSso: data.porcentajeSso,
        porcentajeRpe: data.porcentajeRpe,
        porcentajeFaov: data.porcentajeFaov,
        pagoDirecto: data.pagoDirecto,
        jubilado: data.jubilado,
        cuentaBancaria: data.cuentaBancaria,
        observaciones: data.observaciones,
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
