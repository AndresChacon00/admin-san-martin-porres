import {
  getEstudiantesByCursoPeriodo,
  inscribirEstudianteEnCursoPeriodo,
  eliminarEstudianteDeCursoPeriodo,
} from '../services/estudiantesCursoPeriodo';

import type { EstudianteCursoPeriodoInsert } from '~/types/estudiantesCursoPeriodo.types';

/**
 * Get students enrolled in a course within a period
 * @param idPeriodo - The period ID
 * @param codigoCurso - The course code
 */
export async function obtenerEstudiantesDeCursoPeriodo(
  idPeriodo: string,
  codigoCurso: string,
) {
  try {
    return await getEstudiantesByCursoPeriodo(idPeriodo, codigoCurso);
  } catch (error) {
    console.error(
      'Error al obtener los estudiantes del curso en el periodo:',
      error,
    );
    return { type: 'error', message: 'No se pudieron obtener los estudiantes' };
  }
}

/**
 * Enroll a student in a course within a period
 * @param data - Enrollment data
 */
export async function inscribirEstudianteCursoPeriodo(
  data: EstudianteCursoPeriodoInsert,
) {
  try {
    await inscribirEstudianteEnCursoPeriodo(data);
    return { type: 'success', message: 'Estudiante inscrito en el curso' };
  } catch (error) {
    console.error(
      'Error al inscribir estudiante en el curso del periodo:',
      error,
    );
    return { type: 'error', message: 'No se pudo inscribir el estudiante' };
  }
}

/**
 * Remove a student from a course in a specific period
 * @param idPeriodo - The period ID
 * @param codigoCurso - The course code
 * @param idEstudiante - The student ID
 */
export async function eliminarEstudianteCursoPeriodo(
  idPeriodo: string,
  codigoCurso: string,
  cedula: string,
) {
  try {
    await eliminarEstudianteDeCursoPeriodo(idPeriodo, codigoCurso, cedula);
    return { type: 'success', message: 'Estudiante eliminado del curso' };
  } catch (error) {
    console.error('Error al eliminar estudiante del curso del periodo:', error);
    return { type: 'error', message: 'No se pudo eliminar el estudiante' };
  }
}
