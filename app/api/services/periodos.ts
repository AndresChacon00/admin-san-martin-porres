import type { PeriodoInsert, PeriodoUpdate } from '~/types/periodos.types';
import db from '../db';
import { periodos } from '../tables/periodos';
import { eq } from 'drizzle-orm';

/**
 * Inserts a new period into the database.
 * @author Roberth
 * @param data - Period data to insert.
 * @throws if the period could not be inserted.
 */
export async function createPeriodoInDb(data: PeriodoInsert) {
  const newPeriodo = await db.insert(periodos).values(data).returning();
  return newPeriodo[0];
}

/**
 * Updates a period in the database by ID.
 * @author Roberth
 * @param idPeriodo - The ID of the period to update.
 * @param data - The updated period data.
 * @throws if the period could not be updated.
 */
export async function updatePeriodoInDb(
  idPeriodo: number,
  data: PeriodoUpdate,
) {
  const updatedPeriodo = await db
    .update(periodos)
    .set(data)
    .where(eq(periodos.idPeriodo, idPeriodo))
    .returning();
  return updatedPeriodo[0];
}

/**
 * Deletes a period in the database by ID.
 * @author Roberth
 * @param idPeriodo - The ID of the period to delete.
 * @throws if the period could not be deleted.
 */
export async function deletePeriodoFromDb(idPeriodo: number) {
  await db.delete(periodos).where(eq(periodos.idPeriodo, idPeriodo));
}
