import { EmpleadoForNomina } from '~/types/empleados.types';
import {
  getAllPrimasFromBD,
  getPrimaAcademicaForEmpleado,
  getPrimaAntiguedadForEmpleado,
  getPrimasAcademicasFromBD,
  getPrimasAntiguedadFromBD,
  getPrimasForEmpleado,
} from '../services/primas.server';

/**
 * Endpoint para obtener todas las primas académicas
 * @author Gabriel
 */
export async function getPrimasAcademicas() {
  return await getPrimasAcademicasFromBD();
}

/**
 * Endpoint para obtener todas las primas de antigüedad
 * @author Gabriel
 */
export async function getPrimasAntiguedad() {
  return await getPrimasAntiguedadFromBD();
}

/**
 * Endpoint para obtener todas las primas disponibles
 * @author Gabriel
 */
export async function getAllPrimas() {
  return await getAllPrimasFromBD();
}

/**
 * Endpoint para obtener todas las primas para un empleado
 * @author Gabriel
 * @param empleado Empleado para el cual se calcularán las primas
 */
export async function getAllPrimasForEmpleado(empleado: EmpleadoForNomina) {
  const [primaAcademica, primaAntiguedad, otrasPrimas] = await Promise.all([
    getPrimaAcademicaForEmpleado(empleado),
    getPrimaAntiguedadForEmpleado(empleado),
    getPrimasForEmpleado(empleado),
  ]);
  return {
    primaAcademica,
    primaAntiguedad,
    otrasPrimas,
  };
}
