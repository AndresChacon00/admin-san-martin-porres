import { desc } from 'drizzle-orm';
import db from '../db';
import { periodosEvaluacionDesempeño } from '../tables/periodosEvaluacionDesempeño';
import { PeriodosEvaluacionDesempeñoInsert } from '~/types/periodosEvaluacionDesempeño.types';

/**
 * Get periodos de evaluación de desempeño
 * @author gabrielm
 */
export async function getPeriodosEvaluacionDesmpeño() {
  try {
    const query = await db
      .select()
      .from(periodosEvaluacionDesempeño)
      .orderBy(desc(periodosEvaluacionDesempeño.id));
    return query;
  } catch (error) {
    console.error('Error fetching periodos de evaluación de desempeño:', error);
    throw new Error('Error obteniendo periodos de evaluación de desempeño');
  }
}

/**
 * Crear un nuevo periodo de evaluación de desempeño
 * @author gabrielm
 * @param data
 */
export async function createPeriodoEvaluacionDesempeño(
  data: PeriodosEvaluacionDesempeñoInsert,
) {
  try {
    await db.insert(periodosEvaluacionDesempeño).values(data);
    return {
      type: 'success',
      message:
        'Periodo de evaluación de desempeño creado exitosamente, puede seleccionarlo',
    } as const;
  } catch (error) {
    console.error('Error creating periodo de evaluación de desempeño:', error);
    return {
      type: 'error',
      message: 'Error creando periodo de evaluación de desempeño',
    } as const;
  }
}
