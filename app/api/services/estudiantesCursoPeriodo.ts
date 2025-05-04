import db from '../db';
import { estudiantesCursoPeriodo } from '../tables/estudiantesCursoPeriodo';
import { estudiantes } from '../tables/estudiantes';
import { eq, and } from 'drizzle-orm';
import type { EstudianteCursoPeriodoInsert } from '~/types/estudiantesCursoPeriodo.types';

/**
 * Get all students enrolled in a course within a period
 * @author Roberth
 * @param idPeriodo - The period ID
 * @param codigoCurso - The course code
 */
export async function getEstudiantesByCursoPeriodo(
  idPeriodo: number,
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
  await db.insert(estudiantesCursoPeriodo).values(data);
}

/**
 * Remove a student from a course in a specific period
 * @param idPeriodo - The period ID
 * @param codigoCurso - The course code
 * @param idEstudiante - The student ID
 */
export async function eliminarEstudianteDeCursoPeriodo(
  idPeriodo: number,
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
