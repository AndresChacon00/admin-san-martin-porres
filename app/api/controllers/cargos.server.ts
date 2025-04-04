import { asc } from 'drizzle-orm';
import db from '../db';
import { cargos } from '../tables/cargos';

/**
 * Fetch cargos from DB
 * @author gabrielm
 */
export async function getCargos() {
  try {
    const cargosQuery = await db.select().from(cargos).orderBy(asc(cargos.id));
    return cargosQuery;
  } catch (error) {
    console.error(error);
    throw new Error('Error cargando los cargos');
  }
}
