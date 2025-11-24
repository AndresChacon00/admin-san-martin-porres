import {
  getEstudiantesByCursoPeriodo,
  inscribirEstudianteEnCursoPeriodo,
  eliminarEstudianteDeCursoPeriodo,
  getNotasPorCursoPeriodo,
  actualizarNotasCursoPeriodo,
} from '../services/estudiantesCursoPeriodo';

// Fallback DB access in controller to handle cases where service may be stale
import db from '~/api/db';
import { estudiantesCursoPeriodo } from '~/api/tables/estudiantesCursoPeriodo';
import { estudiantes } from '~/api/tables/estudiantes';
import { cursos } from '~/api/tables/cursos';
import { cursosPeriodo } from '~/api/tables/cursosPeriodo';
import { eq, and } from 'drizzle-orm';

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
    const res = await inscribirEstudianteEnCursoPeriodo(data);
    if (res && typeof (res as { type?: unknown }).type === 'string') {
      if ((res as { type: string }).type === 'success') {
        return { type: 'success', message: 'Estudiante inscrito en el curso' };
      }
      // If service returned an error, try a safe fallback insertion using cedula
      const msg = (res as { type?: string; message?: string }).message || '';
      console.warn(
        'Service returned error, attempting controller fallback:',
        msg,
      );

      // Basic checks before fallback insert
      const estudianteRows = await db
        .select()
        .from(estudiantes)
        .where(eq(estudiantes.cedula, data.cedulaEstudiante));
      if (!estudianteRows || estudianteRows.length === 0) {
        return {
          type: 'error',
          message: 'No existe un estudiante con la cédula proporcionada',
        };
      }

      const cursoRows = await db
        .select()
        .from(cursos)
        .where(eq(cursos.codigo, data.codigoCurso));
      if (!cursoRows || cursoRows.length === 0) {
        return { type: 'error', message: 'El curso indicado no existe' };
      }

      const cpRows = await db
        .select()
        .from(cursosPeriodo)
        .where(
          and(
            eq(cursosPeriodo.idPeriodo, data.idPeriodo),
            eq(cursosPeriodo.idCurso, data.codigoCurso),
          ),
        );
      if (!cpRows || cpRows.length === 0) {
        return {
          type: 'error',
          message: 'El curso no está registrado en el periodo seleccionado',
        };
      }

      try {
        await db.insert(estudiantesCursoPeriodo).values({
          idPeriodo: data.idPeriodo,
          codigoCurso: data.codigoCurso,
          cedulaEstudiante: data.cedulaEstudiante,
        });
        return {
          type: 'success',
          message: 'Estudiante inscrito en el curso (fallback)',
        };
      } catch (err: unknown) {
        console.error('Fallback insert failed:', err);
        const message =
          err && typeof err === 'object' && 'message' in err
            ? String((err as unknown as { message?: unknown }).message)
            : String(err);
        return {
          type: 'error',
          message: message || 'No se pudo inscribir el estudiante',
        };
      }
    }
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

/**
 * Obtener notas de todos los estudiantes de un curso en un periodo
 */
export async function obtenerNotasCursoPeriodo(
  idPeriodo: string,
  codigoCurso: string,
) {
  try {
    return await getNotasPorCursoPeriodo(idPeriodo, codigoCurso);
  } catch (err) {
    console.error('Error al obtener notas:', err);
    return { type: 'error', message: 'No se pudieron obtener las notas' };
  }
}

/**
 * Actualizar notas de estudiantes para un curso/periodo
 * `notas` expected: Array<{ cedula, notaCuantitativa?, notaCualitativa? }>
 */
export async function actualizarNotasCursoPeriodoController(
  idPeriodo: string,
  codigoCurso: string,
  notas: Array<{
    cedula: string;
    notaCuantitativa?: number | null;
    notaCualitativa?: string | null;
  }>,
) {
  try {
    const res = await actualizarNotasCursoPeriodo(
      idPeriodo,
      codigoCurso,
      notas,
    );
    return { type: 'success', result: res };
  } catch (err) {
    console.error('Error al actualizar notas:', err);
    return { type: 'error', message: 'No se pudieron actualizar las notas' };
  }
}
