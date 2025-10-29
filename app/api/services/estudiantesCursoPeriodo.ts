import db from '../db';
import { estudiantesCursoPeriodo } from '../tables/estudiantesCursoPeriodo';
import { estudiantes } from '../tables/estudiantes';
import { cursos } from '../tables/cursos';
import { cursosPeriodo } from '../tables/cursosPeriodo';
import { eq, and } from 'drizzle-orm';
import type { EstudianteCursoPeriodoInsert } from '~/types/estudiantesCursoPeriodo.types';

/**
 * Get all students enrolled in a course within a period
 * @author Roberth
 * @param idPeriodo - The period ID
 * @param codigoCurso - The course code
 */
export async function getEstudiantesByCursoPeriodo(
  idPeriodo: string,
  codigoCurso: string,
) {
  return await db
    .select({
      nombre: estudiantes.nombre,
      apellido: estudiantes.apellido,
      cedula: estudiantes.cedula,
      genero: estudiantes.sexo,
      fechaNacimiento: estudiantes.fechaNacimiento,
      telefono: estudiantes.telefono,
      correo: estudiantes.correo,
      direccion: estudiantes.direccion,
    })
    .from(estudiantesCursoPeriodo)
    .innerJoin(
      estudiantes,
      eq(estudiantesCursoPeriodo.cedulaEstudiante, estudiantes.cedula),
    )
    .where(
      and(
        eq(estudiantesCursoPeriodo.idPeriodo, idPeriodo),
        eq(estudiantesCursoPeriodo.codigoCurso, codigoCurso),
      ),
    );
}

/**
 * Enroll a student in a course for a specific period
 * @param data - Enrollment data
 */
export async function inscribirEstudianteEnCursoPeriodo(
  data: EstudianteCursoPeriodoInsert,
) {
  // Validate referenced rows to avoid FK constraint exceptions and provide
  // friendly error messages.

  // 1) Estudiante exists
  const estudiantesRows = await db
    .select()
    .from(estudiantes)
    .where(eq(estudiantes.cedula, data.cedulaEstudiante));

  if (!estudiantesRows || estudiantesRows.length === 0) {
    return {
      type: 'error',
      message: 'No existe un estudiante con la cédula proporcionada',
    };
  }

  // 2) Curso exists
  const cursoRows = await db
    .select()
    .from(cursos)
    .where(eq(cursos.codigo, data.codigoCurso));

  if (!cursoRows || cursoRows.length === 0) {
    return { type: 'error', message: 'El curso indicado no existe' };
  }

  // 3) Curso is registered in the given periodo (cursos_periodo)
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

  // 4) Try insert and capture any DB-level errors (e.g., duplicate)
  try {
    await db.insert(estudiantesCursoPeriodo).values(data);
    return { type: 'success' };
  } catch (err: unknown) {
    let raw = String(err);
    if (err && typeof err === 'object' && 'message' in err) {
      const e = err as { message?: unknown };
      if (typeof e.message === 'string') raw = e.message;
    }
    // Surface constraint/unique messages when possible
    if (
      raw.toLowerCase().includes('unique') ||
      raw.toLowerCase().includes('constraint')
    ) {
      return { type: 'error', message: raw };
    }
    return {
      type: 'error',
      message: 'Error al inscribir estudiante en el curso',
    };
  }
}

/**
 * Remove a student from a course in a specific period
 * @param idPeriodo - The period ID
 * @param codigoCurso - The course code
 * @param idEstudiante - The student ID
 */
export async function eliminarEstudianteDeCursoPeriodo(
  idPeriodo: string,
  codigoCurso: string,
  cedulaEstudiante: string,
) {
  await db
    .delete(estudiantesCursoPeriodo)
    .where(
      and(
        eq(estudiantesCursoPeriodo.idPeriodo, idPeriodo),
        eq(estudiantesCursoPeriodo.codigoCurso, codigoCurso),
        eq(estudiantesCursoPeriodo.cedulaEstudiante, cedulaEstudiante),
      ),
    );
}
