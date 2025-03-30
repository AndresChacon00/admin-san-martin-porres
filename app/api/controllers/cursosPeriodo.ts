import type { CursoPeriodoInsert } from '~/types/cursosPeriodo.types';
import {
  addCursoToPeriodo,
  getCursosByPeriodo,
  removeCursoFromPeriodo,
} from '../services/cursosPeriodo';

/**
 * Adds a course to a period
 * @author Roberth
 * @param idPeriodo - The ID of the period
 * @param idCurso - The ID of the course to be added
 * @returns A success or error message
 */
export async function inscribirCursoEnPeriodo(
  idPeriodo: number,
  idCurso: number,
  horario: string,
): Promise<{ type: 'success' | 'error'; message: string }> {
  try {
    const data: CursoPeriodoInsert = { idPeriodo, idCurso, horario };
    await addCursoToPeriodo(data);
    return { type: 'success', message: 'Curso inscrito en el periodo' };
  } catch (error) {
    console.error('Error al inscribir curso en periodo:', error);
    return { type: 'error', message: 'No se pudo inscribir el curso' };
  }
}

/**
 * Retrieves all courses associated with a specific period
 * @author Roberth
 * @param idPeriodo - The ID of the period
 * @returns A list of courses or an error message
 */
export async function obtenerCursosPorPeriodo(idPeriodo: number) {
  try {
    const cursos = await getCursosByPeriodo(idPeriodo);
    return cursos;
  } catch (error) {
    console.error('Error al obtener cursos del periodo:', error);
    return { type: 'error', message: 'No se pudieron obtener los cursos' };
  }
}

/**
 * Removes a course from a period
 * @author Roberth
 * @param idPeriodo - The ID of the period
 * @param idCurso - The ID of the course to be removed
 * @returns A success or error message
 */
export async function eliminarCursoDePeriodo(
  idPeriodo: number,
  idCurso: number,
): Promise<{ type: 'success' | 'error'; message: string }> {
  try {
    await removeCursoFromPeriodo(idPeriodo, idCurso);
    return { type: 'success', message: 'Curso eliminado del periodo' };
  } catch (error) {
    console.error('Error al eliminar curso del periodo:', error);
    return { type: 'error', message: 'No se pudo eliminar el curso' };
  }
}
