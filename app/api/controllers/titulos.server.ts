import { asc, eq } from 'drizzle-orm';
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

/**
 * Get single titulo by id
 * @author gabrielm
 * @param id
 */
export async function getTituloById(id: number) {
  try {
    const tituloQuery = await db
      .select()
      .from(titulos)
      .where(eq(titulos.id, id))
      .limit(1);
    return tituloQuery[0];
  } catch (error) {
    console.error('Error al obtener el título: ', error);
    throw new Error('Error al obtener el título');
  }
}
