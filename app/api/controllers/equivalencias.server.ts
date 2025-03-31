import { asc, eq } from 'drizzle-orm';
import { equivCargos } from '../tables/equivCargos';
import db from '../db';
import { equivNiveles } from '../tables/equivNiveles';
import { equivGrados } from '../tables/equivGrados';

type TipoPersonal = 'administrativo' | 'instructor';

/**
 * Equivalencias de cargos por tipo de personal
 * @author gabrielm
 * @param tipoPersonal
 */
export async function getEquivalenciasCargos(tipoPersonal: TipoPersonal) {
  try {
    const equivalenciasQuery = await db
      .select()
      .from(equivCargos)
      .where(eq(equivCargos.tipoPersonal, tipoPersonal))
      .orderBy(asc(equivCargos.id));
    return equivalenciasQuery;
  } catch (error) {
    console.error('Error al obtener las equivalencias de cargos: ', error);
    throw new Error('Error al obtener las equivalencias de cargos');
  }
}

/**
 * Equivalencias de niveles
 * @author gabrielm
 */
export async function getEquivalenciasNiveles() {
  try {
    const equivalenciasQuery = await db
      .select()
      .from(equivNiveles)
      .orderBy(asc(equivNiveles.id));
    return equivalenciasQuery;
  } catch (error) {
    console.error('Error al obtener las equivalencias de niveles: ', error);
    throw new Error('Error al obtener las equivalencias de niveles');
  }
}

/**
 * Equivalencias de grados por tipo de personal
 * @param tipoPersonal
 */
export async function getEquivalenciasGrados(tipoPersonal: TipoPersonal) {
  try {
    const equivalenciasQuery = await db
      .select()
      .from(equivGrados)
      .where(eq(equivGrados.tipoPersonal, tipoPersonal))
      .orderBy(asc(equivGrados.id));
    return equivalenciasQuery;
  } catch (error) {
    console.error('Error al obtener las equivalencias de grados: ', error);
    throw new Error('Error al obtener las equivalencias de grados');
  }
}
