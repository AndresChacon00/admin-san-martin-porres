import { desc } from 'drizzle-orm';
import db from '../db';
import { periodosAlimentario } from '../tables/periodosAlimentario';
import type { PeriodosAlimentarioInsert } from '~/types/periodosAlimentario.types';

/**
 * Get periodos de programa alimentario
 * @author gabrielm
 */
export async function getPeriodosAlimentario() {
  try {
    const query = await db
      .select()
      .from(periodosAlimentario)
      .orderBy(desc(periodosAlimentario.id));
    return query;
  } catch (error) {
    console.error('Error fetching periodos del programa alimentario:', error);
    throw new Error('Error obteniendo periodos del programa alimentario');
  }
}

/**
 * Crear un nuevo periodo de nómina
 * @author gabrielm
 * @param data
 */
export async function createPeriodoAlimentario(
  data: PeriodosAlimentarioInsert,
) {
  try {
    await db.insert(periodosAlimentario).values(data);
    return {
      type: 'success',
      message:
        'Periodo del programa alimentario creado exitosamente, puede seleccionarlo',
    } as const;
  } catch (error) {
    console.error('Error creating periodo de nomina:', error);
    return {
      type: 'error',
      message: 'Error creando periodo del programa alimentario',
    } as const;
  }
}
