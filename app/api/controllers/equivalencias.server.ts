import { asc, eq } from 'drizzle-orm';
import { equivCargos } from '../tables/equivCargos';
import db from '../db';
import { equivNiveles } from '../tables/equivNiveles';
import { equivGrados } from '../tables/equivGrados';
import { cargos } from '../tables/cargos';
import { niveles } from '../tables/niveles';
import { grados } from '../tables/grados';
import { titulos } from '../tables/titulos';
import {
  EquivalenciaCargo,
  EquivalenciaGrado,
  EquivalenciaNivel,
  TipoPersonal,
} from '~/types/equivalencias.types';

/**
 * Equivalencias de cargos por tipo de personal
 * @author gabrielm
 * @param tipoPersonal
 * @throws
 */
export async function getEquivalenciasCargos(
  tipoPersonal: TipoPersonal | 'todos',
): Promise<EquivalenciaCargo[]> {
  try {
    const equivalenciasQuery = await db
      .select({
        id: equivCargos.id,
        cargoId: equivCargos.cargo,
        codigoCargo: cargos.codigo,
        nivelCargo: cargos.nivelCargo,
        nombreCargo: cargos.nombreCargo,
        nivelId: equivCargos.nivel,
        nombreNivel: niveles.nombre,
        tipoPersonal: equivCargos.tipoPersonal,
      })
      .from(equivCargos)
      .innerJoin(cargos, eq(cargos.id, equivCargos.cargo))
      .innerJoin(niveles, eq(niveles.id, equivCargos.nivel))
      .where(
        tipoPersonal !== 'todos'
          ? eq(equivCargos.tipoPersonal, tipoPersonal)
          : undefined,
      )
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
 * @throws
 */
export async function getEquivalenciasNiveles(): Promise<EquivalenciaNivel[]> {
  try {
    const equivalenciasQuery = await db
      .select({
        nivelId: equivNiveles.nivel,
        nombreNivel: niveles.nombre,
        minTiempoServicio: equivNiveles.minTiempoServicio,
        formacionCrecimientoPersonal: equivNiveles.formacionCrecimientoPersonal,
      })
      .from(equivNiveles)
      .innerJoin(niveles, eq(niveles.id, equivNiveles.nivel))
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
 * @throws
 */
export async function getEquivalenciasGrados(
  tipoPersonal: TipoPersonal | 'todos',
): Promise<EquivalenciaGrado[]> {
  try {
    const equivalenciasQuery = await db
      .select({
        id: equivGrados.id,
        gradoId: equivGrados.grado,
        nombreGrado: grados.codigo,
        tituloId: equivGrados.titulo,
        codTitulo: titulos.codigo,
        nombreTitulo: titulos.nombre,
        experienciaLaboral: equivGrados.experienciaLaboral,
        formacionTecnicoProfesional: equivGrados.formacionTecnicoProfesional,
        tipoPersonal: equivGrados.tipoPersonal,
      })
      .from(equivGrados)
      .innerJoin(grados, eq(grados.id, equivGrados.grado))
      .innerJoin(titulos, eq(titulos.id, equivGrados.titulo))
      .where(
        tipoPersonal !== 'todos'
          ? eq(equivGrados.tipoPersonal, tipoPersonal)
          : undefined,
      )
      .orderBy(asc(equivGrados.id));
    return equivalenciasQuery;
  } catch (error) {
    console.error('Error al obtener las equivalencias de grados: ', error);
    throw new Error('Error al obtener las equivalencias de grados');
  }
}
