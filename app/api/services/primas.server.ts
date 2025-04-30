import type { EmpleadoForNomina } from '~/types/empleados.types';
import db from '../db';
import { asc, eq } from 'drizzle-orm';
import { primasAntiguedad } from '../tables/primasAntiguedad';
import { primasAcademicas } from '../tables/primasAcademicas';
import { primas } from '../tables/primas';

/**
 * Obtiene todas las primas de antigüedad de la BD ordenadas por tiempo de servicio
 * @author Gabriel
 * @throws Error si no se puede obtener la prima de antigüedad
 */
export async function getPrimasAntiguedadFromBD() {
  try {
    const primas = await db
      .select()
      .from(primasAntiguedad)
      .orderBy(asc(primasAntiguedad.tiempoServicio));
    return primas;
  } catch (error) {
    console.error('Error al obtener las primas de antigüedad: ', error);
    throw new Error('Error al obtener las primas de antigüedad');
  }
}

/**
 * Obtiene todas las primas académicas de la BD
 * @author Gabriel
 * @throws Error si no se puede obtener la prima académica
 */
export async function getPrimasAcademicasFromBD() {
  try {
    const primas = await db.select().from(primasAcademicas);
    return primas;
  } catch (error) {
    console.error('Error al obtener las primas académicas: ', error);
    throw new Error('Error al obtener las primas académicas');
  }
}

/**
 * Obtiene todas las primas de la BD
 * @author Gabriel
 * @throws Error si no se pueden obtener las primas
 */
export async function getAllPrimasFromBD() {
  try {
    const primasBd = await db.select().from(primas);
    return primasBd;
  } catch (error) {
    console.error('Error al obtener las primas: ', error);
    throw new Error('Error al obtener las primas');
  }
}

/**
 * Obtiene el monto por prima de antigüedad para un empleado específico
 * @author Gabriel
 * @param empleado Empleado para el cual se calculará la prima de antigüedad
 * @throws Error si no se puede obtener la prima de antigüedad
 */
export async function getPrimaAntiguedadForEmpleado(
  empleado: EmpleadoForNomina,
) {
  const { fechaIngresoAvec } = empleado;
  const fechaActual = new Date();
  const fechaIngreso = new Date(fechaIngresoAvec);
  const diferenciaTiempo = fechaActual.getTime() - fechaIngreso.getTime();
  const diferenciaAnios = Math.floor(
    diferenciaTiempo / (1000 * 60 * 60 * 24 * 365.25), // Considerando años bisiestos
  );

  const primas = await getPrimasAntiguedadFromBD();
  const primaAntiguedad = primas
    .filter((prima) => prima.tiempoServicio <= diferenciaAnios)
    .at(-1);

  const prima = primaAntiguedad?.porcentaje || 0;
  return prima * empleado.sueldo;
}

/**
 * Devuelve el monto por prima académica para un empleado específico
 * @author Gabriel
 * @param empleado Empleado para el cual se calculará la prima académica
 */
export async function getPrimaAcademicaForEmpleado(
  empleado: EmpleadoForNomina,
) {
  const { titulo, nivelAcademico } = empleado;
  const primasAcademicas = await getPrimasAcademicasFromBD();
  if (nivelAcademico) {
    const primaAcademica = primasAcademicas.find(
      (prima) => prima.nivelAcademico === nivelAcademico,
    );
    const prima = primaAcademica?.porcentaje || 0;
    return prima * empleado.sueldo;
  } else {
    let nivel = '';
    if (titulo.includes('TSU')) {
      nivel = 'TSU';
    }
    if (titulo.includes('Licenciado')) {
      nivel = 'LICENCIADO';
    }
    const primaAcademica = primasAcademicas.find(
      (prima) => prima.nivelAcademico === nivel,
    );
    const prima = primaAcademica?.porcentaje || 0;
    return prima * empleado.sueldo;
  }
}

/**
 * Devuelve el listado de montos por primas generales para un empleado específico
 * @author Gabriel
 * @param empleado Empleado para el cual se calcularán las primas
 */
export async function getPrimasForEmpleado(empleado: EmpleadoForNomina) {
  const primas = await getAllPrimasFromBD();
  const primasEmpleado = [];
  for (const prima of primas) {
    if (prima.tipoFactor === 'factor' || prima.tipoFactor === 'porcentaje') {
      if (prima.campoBase === 'Salario Base') {
        primasEmpleado.push({
          nombre: prima.nombre,
          monto: prima.factor * empleado.sueldo,
          tipo: prima.frecuencia,
        });
      } else if (prima.campoBase === 'Sueldo Base Mínimo') {
        primasEmpleado.push({
          nombre: prima.nombre,
          monto: prima.factor * 175,
          tipo: prima.frecuencia,
        });
      } else if (prima.campoBase === 'Salario Integral') {
        primasEmpleado.push({
          nombre: prima.nombre,
          monto: prima.factor * empleado.sueldo * 1.5, // @todo Revisar si es correcto
          tipo: prima.frecuencia,
        });
      } else if (prima.campoBase === 'Hijos') {
        primasEmpleado.push({
          nombre: prima.nombre,
          monto: prima.factor * empleado.hijos,
          tipo: prima.frecuencia,
        });
      }
    } else if (prima.tipoFactor === 'constante') {
      primasEmpleado.push({
        nombre: prima.nombre,
        monto: prima.factor,
        tipo: prima.frecuencia,
      });
    } else if (prima.tipoFactor === 'dias') {
      primasEmpleado.push({
        nombre: prima.nombre,
        monto: (prima.factor * empleado.sueldo) / 30, // Sueldo es mensual
        tipo: prima.frecuencia,
      });
    }
  }
  return primasEmpleado;
}

/**
 * Busca una prima disponible por nombre
 * @author gabrielm
 * @param name
 */
export async function getPrimaByName(name: string) {
  try {
    const primasQuery = await db
      .select()
      .from(primas)
      .where(eq(primas.nombre, name))
      .limit(1);
    if (primasQuery.length) {
      return primasQuery[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
