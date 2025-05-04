import { asc, eq } from 'drizzle-orm';
import db from '../db';
import { escalaSueldoPersonal } from '../tables/escalaSueldoPersonal';
import { EscalaSueldoPersonal, TipoPersonal } from '~/types/escalaSueldoPersonal.types';

/**
 * Obtiene la escala de sueldo del personal
 * @author Bertorelli
 */
export async function getEscalaSueldoPersonal(
  tipoPersonal: TipoPersonal | 'todos',
): Promise<EscalaSueldoPersonal[]>{
  try {
    const escalaSueldoQuery = await db
        .select({
            id: escalaSueldoPersonal.id,
            nivel: escalaSueldoPersonal.nivel,
            grado: escalaSueldoPersonal.grado,
            tipoPersonal: escalaSueldoPersonal.tipoPersonal,
            escalaSueldo: escalaSueldoPersonal.escalaSueldo,
        })
        .from(escalaSueldoPersonal)
        .where(
            tipoPersonal !== 'todos'
            ? eq(escalaSueldoPersonal.tipoPersonal, tipoPersonal)
            : undefined,
        )
        .orderBy(asc(escalaSueldoPersonal.id));
    return escalaSueldoQuery;
  } catch (error) {
    console.error('Error al obtener la escala de sueldo del personal: ', error);
    throw new Error('Error al obtener la escala de sueldo del personal');
  }
}

/**
 * Edita solo el sueldo de una escala de sueldo del personal
 * @param id Identificador de la escala de sueldo
 * @param sueldo Nuevo valor del sueldo
 */
export async function updateEscalaSueldoPersonal(
  id: number,
  data: Partial<typeof escalaSueldoPersonal.$inferInsert>,
) {
  try {
    const updatedEscalaSueldo = await db
      .update(escalaSueldoPersonal)
      .set({
        escalaSueldo: data.escalaSueldo,
      })
      .where(eq(escalaSueldoPersonal.id, id))
      .returning();
    return updatedEscalaSueldo;
  } catch (error) {
    console.error('Error al editar la escala de sueldo del personal: ', error);
    throw new Error('Error al editar la escala de sueldo del personal');
  }
}
