import { asc } from 'drizzle-orm';
import db from '../db';
import { niveles } from '../tables/niveles';

/**
 * Fetch niveles from DB
 * @author gabrielm
 */
export async function getNiveles() {
  try {
    const nivelesQuery = await db
      .select()
      .from(niveles)
      .orderBy(asc(niveles.id));
    return nivelesQuery;
  } catch (error) {
    console.error('Error al obtener los niveles: ', error);
    throw new Error('Error al obtener los niveles');
  }
}
