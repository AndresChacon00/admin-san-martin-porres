import db from '../db';
import type { CursoPeriodoInsert } from '~/types/cursosPeriodo.types';
import { cursosPeriodo } from '../tables/cursosPeriodo';
import { cursos } from '../tables/cursos';
import { eq, and } from 'drizzle-orm';

/**
 * Insert a new course-period relationship into the database
 * @author Roberth
 * @param data - The course and period association to insert
 * @throws if the association could not be inserted
 */
export async function addCursoToPeriodo(data: CursoPeriodoInsert) {
  await db.insert(cursosPeriodo).values(data);
}

/**
 * Get all courses associated with a specific period
 * @author Roberth
 * @param idPeriodo - The ID of the period to filter courses by
 * @returns A list of courses linked to the given period
 * @throws if there is an error fetching courses
 */
export async function getCursosByPeriodo(idPeriodo: string) {
  const cursosEnPeriodo = await db
    .select({
      idPeriodo: cursosPeriodo.idPeriodo,
      codigo: cursos.codigo, // Unique identifier for cursos
      nombreCurso: cursos.nombreCurso,
      descripcion: cursos.descripcion,
      horario: cursosPeriodo.horario,
      precioTotal: cursos.precioTotal,
    })
    .from(cursosPeriodo)
    .innerJoin(cursos, eq(cursosPeriodo.idCurso, cursos.codigo)) // Join using 'codigo' instead of 'idCurso'
    .where(eq(cursosPeriodo.idPeriodo, idPeriodo));

  return cursosEnPeriodo;
}

/**
 * Remove a specific course from a period in the database
 * @author Roberth
 * @param idPeriodo - The ID of the period
 * @param idCurso - The ID of the course to be removed from the period
 * @throws if the course could not be removed from the period
 */
export async function removeCursoFromPeriodo(
  idPeriodo: string,
  idCurso: string,
) {
  await db
    .delete(cursosPeriodo)
    .where(
      and(
        eq(cursosPeriodo.idPeriodo, idPeriodo),
        eq(cursosPeriodo.idCurso, idCurso),
      ),
    );
}
