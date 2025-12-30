import type { CursoInsert, CursoUpdate } from '~/types/cursos.types';
import db from '../db';
import { cursos } from '../tables/cursos';
import { eq } from 'drizzle-orm';
import { Layout } from '~/types/certificados.types';

/**
 * Read the parsed template layout JSON for a course (if any)
 */
export async function getTemplateLayoutFromDb(
  codigo: string,
): Promise<Layout | null> {
  try {
    const rows = await db
      .select()
      .from(cursos)
      .where(eq(cursos.codigo, codigo));
    const curso = rows && rows.length ? rows[0] : null;
    const raw = curso ? (curso.templateLayout ?? null) : null;
    return raw ? JSON.parse(raw || '{}') : null;
  } catch (error) {
    console.error('Error reading template layout from DB', error);
    return null;
  }
}

/**
 * Save the template layout JSON for a course
 */
export async function saveTemplateLayoutInDb(
  codigo: string,
  layoutJson: string,
) {
  try {
    const updated = await updateCursoInDb(codigo, {
      templateLayout: layoutJson,
    } as unknown as CursoUpdate);
    return updated;
  } catch (error) {
    console.error('Error saving template layout to DB', error);
    throw error;
  }
}

/**
 * Insert a new course into the database
 * @author Roberth
 * @param data
 * @throws if the course could not be inserted
 */
export async function createCursoInDb(data: Partial<CursoInsert>) {
  // Ensure we have a codigo; if not, generate an incremental numeric code
  // We'll try to find the max numeric code currently in the DB and increment it.
  // Codes that are non-numeric (e.g., fallback values) are ignored for incrementing.
  const providedCodigo =
    data.codigo && String(data.codigo).trim() !== ''
      ? String(data.codigo)
      : null;
  let codigo = providedCodigo;
  if (!codigo) {
    // Fetch existing codes and compute the next numeric code
    const rows = await db.select({ codigo: cursos.codigo }).from(cursos);
    const existingCodes = new Set<string>(
      rows.map((r) => String(r.codigo ?? '')),
    );
    const numericValues = rows
      .map((r) => String(r.codigo ?? '').trim())
      .filter((c: string) => /^\d+$/.test(c))
      .map((c: string) => parseInt(c, 10));

    let next = 1;
    if (numericValues.length > 0) {
      next = Math.max(...numericValues) + 1;
    }

    const pad = (n: number) => n.toString().padStart(4, '0');
    // find first unused padded candidate
    let candidate = pad(next);
    // If candidate exists (very unlikely), increment until we find a free one
    while (existingCodes.has(candidate)) {
      next += 1;
      candidate = pad(next);
      // protect against pathological loops
      if (next > 999999) {
        break;
      }
    }

    // If after the loop we still collide (or next exceeded a large bound), fallback
    codigo = existingCodes.has(candidate) ? `C${Date.now()}` : candidate;
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
