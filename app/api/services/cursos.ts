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
export async function createCursoInDb(data: Partial<CursoInsert>) {
  // Ensure we have a codigo; if not, generate a short 4-digit numeric code
  // Try to avoid collisions by checking the DB; fallback to timestamp-based code after attempts
  const providedCodigo =
    data.codigo && String(data.codigo).trim() !== ''
      ? String(data.codigo)
      : null;
  let codigo = providedCodigo;
  if (!codigo) {
    const maxAttempts = 10;
    let attempt = 0;
    const pad = (n: number) => n.toString().padStart(4, '0');
    while (attempt < maxAttempts) {
      // generate random 4-digit numeric string
      const candidate = pad(Math.floor(Math.random() * 10000));
      // check uniqueness
      const existing = await db
        .select()
        .from(cursos)
        .where(eq(cursos.codigo, candidate));
      if (!existing || existing.length === 0) {
        codigo = candidate;
        break;
      }
      attempt += 1;
    }
    if (!codigo) {
      // fallback: timestamp prefixed with C
      codigo = `C${Date.now()}`;
    }
  }
  const toInsert: CursoInsert = {
    codigo,
    nombreCurso: (data.nombreCurso as string) || '',
    descripcion: (data.descripcion as string) || null,
    estado: typeof data.estado === 'number' ? data.estado : 1,
    precioTotal: (data.precioTotal as number) || null,
  } as unknown as CursoInsert;

  const newCurso = await db.insert(cursos).values(toInsert).returning();
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
