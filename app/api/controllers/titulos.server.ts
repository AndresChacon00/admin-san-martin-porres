import { asc } from 'drizzle-orm';
import db from '../db';
import { titulos } from '../tables/titulos';

/**
 * Fetch titulos from DB
 * @author gabrielm
 */
export async function getTitulos() {
  try {
    const titulosQuery = await db
      .select()
      .from(titulos)
      .orderBy(asc(titulos.id));
    return titulosQuery;
  } catch (error) {
    console.error('Error al obtener los títulos: ', error);
    throw new Error('Error al obtener los títulos');
  }
}
