import { desc } from 'drizzle-orm';
import db from '../db';
import { periodosNomina } from '../tables/periodoNomina';
import { PeriodoNominaInsert } from '~/types/periodosNomina.types';

/**
 * Get periodos de nómina
 * @author gabrielm
 */
export async function getPeriodosNomina() {
  try {
    const periodosNominaQuery = await db
      .select()
      .from(periodosNomina)
      .orderBy(desc(periodosNomina.id));
    return periodosNominaQuery;
  } catch (error) {
    console.error('Error fetching periodos de nomina:', error);
    throw new Error('Error obteniendo periodos de nomina');
  }
}

/**
 * Crear un nuevo periodo de nómina
 * @author gabrielm
 * @param data
 */
export async function createPeriodoNomina(data: PeriodoNominaInsert) {
  try {
    await db.insert(periodosNomina).values(data);
    return {
      type: 'success',
      message: 'Periodo de nómina creado exitosamente, puede seleccionarlo',
    } as const;
  } catch (error) {
    console.error('Error creating periodo de nomina:', error);
    return {
      type: 'error',
      message: 'Error creando periodo de nómina',
    } as const;
  }
}
