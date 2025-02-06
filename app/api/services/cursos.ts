import type { CursoInsert, CursoUpdate } from '~/types/cursos.types';
import db from '../db';
import { cursos } from '../tables/cursos';
import { eq } from 'drizzle-orm';

/**
 * Insert a new course into the database
 * @author Roberth
 * @param data
 * @throws if the course could not be inserted
 */
export async function createCursoInDb(data: CursoInsert) {
  const newCurso = await db.insert(cursos).values(data).returning();
  return newCurso[0];
}

/**
 * Updates a course in the database by code
 * @author Roberth
 * @param codigo
 * @param data
 * @throws if the course could not be updated
 */
export async function updateCursoInDb(codigo: string, data: CursoUpdate) {
  const updatedCurso = await db
    .update(cursos)
    .set(data)
    .where(eq(cursos.codigo, codigo))
    .returning();
  return updatedCurso[0];
}

/**
 * Deletes a course in the database by code
 * @author Roberth
 * @param codigo
 * @throws if the course could not be deleted
 */
export async function deleteCursoFromDb(codigo: string) {
  await db.delete(cursos).where(eq(cursos.codigo, codigo));
}
