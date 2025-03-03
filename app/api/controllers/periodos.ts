import { desc, eq } from 'drizzle-orm';
import db from '../db';
import { periodos } from '../tables/periodos';
import type { PeriodoInsert, PeriodoUpdate } from '~/types/periodos.types';
import {
  createPeriodoInDb,
  updatePeriodoInDb,
  deletePeriodoFromDb,
} from '../services/periodos';

/**
 * Get full list of periods
 * @author Roberth
 */
export async function getPeriodos() {
  try {
    const periodosList = await db
      .select()
      .from(periodos)
      .orderBy(desc(periodos.idPeriodo));
    return periodosList;
  } catch (error) {
    console.error('Error al obtener los periodos: ', error);
    return {
      type: 'error',
      message: 'Error al obtener los periodos',
    } as const;
  }
}

/**
 * Get single period by ID
 * @author Roberth
 * @param idPeriodo
 */
export async function getPeriodoById(idPeriodo: number) {
  try {
    const period = await db
      .select()
      .from(periodos)
      .where(eq(periodos.idPeriodo, idPeriodo));
    return period[0];
  } catch (error) {
    console.error('Error al obtener un periodo por ID: ', error);
    return {
      type: 'error',
      message: 'Error al obtener un periodo por ID',
    } as const;
  }
}

/**
 * Endpoint for adding a period
 * @author Roberth
 * @param data
 */
export async function addPeriodo(data: PeriodoInsert) {
  try {
    const newPeriodo = await createPeriodoInDb(data);
    return newPeriodo;
  } catch (error) {
    console.error('Error al añadir un periodo: ', error);
    return {
      type: 'error',
      message: 'Error al añadir un periodo',
    } as const;
  }
}

/**
 * Endpoint for updating a period by ID
 * @author Roberth
 * @param idPeriodo
 * @param data
 */
export async function updatePeriodo(idPeriodo: number, data: PeriodoUpdate) {
  try {
    const updated = await updatePeriodoInDb(idPeriodo, data);
    return updated;
  } catch (error) {
    console.error('Error al actualizar un periodo: ', error);
    return {
      type: 'error',
      message: 'Error al actualizar un periodo',
    } as const;
  }
}

/**
 * Endpoint for deleting a period by ID
 * @author Roberth
 * @param idPeriodo
 */
export async function deletePeriodo(idPeriodo: number) {
  try {
    await deletePeriodoFromDb(idPeriodo);
    return {
      type: 'success',
      message: 'Periodo eliminado exitosamente',
    } as const;
  } catch (error) {
    console.error('Error al eliminar un periodo: ', error);
    return {
      type: 'error',
      message: 'Error al eliminar un periodo',
    } as const;
  }
}
