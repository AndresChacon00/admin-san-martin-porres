import { asc } from 'drizzle-orm';
import db from '../db';
import { grados } from '../tables/grados';

/**
 * Fetch list of grados from DB
 * @author gabrielm
 */
export async function getGrados() {
  try {
    const gradosQuery = await db.select().from(grados).orderBy(asc(grados.id));
    return gradosQuery;
  } catch (error) {
    console.error(error);
    throw new Error('Error cargando grados');
  }
}
