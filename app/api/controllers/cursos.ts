import { desc, eq } from 'drizzle-orm';
import db from '../db';
import { cursos } from '../tables/cursos';
import type { CursoInsert, CursoUpdate } from '~/types/cursos.types';
import {
  createCursoInDb,
  updateCursoInDb,
  deleteCursoFromDb,
} from '../services/cursos';

/**
 * Get full list of courses
 * @author Roberth
 */
export async function getCursos() {
  try {
    const cursosList = await db
      .select()
      .from(cursos)
      .orderBy(desc(cursos.codigo));
    return cursosList;
  } catch (error) {
    console.error('Error al obtener los cursos: ', error);
    return {
      type: 'error',
      message: 'Error al obtener los cursos',
    } as const;
  }
}

/**
 * Get single course by ID
 * @author Roberth
 * @param codigo
 */
export async function getCursoById(codigo: string) {
  try {
    const curso = await db
      .select()
      .from(cursos)
      .where(eq(cursos.codigo, codigo));
    return curso[0];
  } catch (error) {
    console.error('Error al obtener un curso por ID: ', error);
    return {
      type: 'error',
      message: 'Error al obtener un curso por ID',
    } as const;
  }
}

/**
 * Endpoint for adding a course
 * @author Roberth
 * @param data
 */
export async function addCurso(data: CursoInsert) {
  try {
    const newCurso = await createCursoInDb(data);
    return newCurso;
  } catch (error) {
    console.error('Error al añadir un curso: ', error);
    return {
      type: 'error',
      message: 'Error al añadir un curso',
    } as const;
  }
}

/**
 * Endpoint for updating a course by ID
 * @author Roberth
 * @param codigo
 * @param data
 */
export async function updateCurso(codigo: string, data: CursoUpdate) {
  try {
    const updated = await updateCursoInDb(codigo, data);
    return updated;
  } catch (error) {
    console.error('Error al actualizar un curso: ', error);
    return {
      type: 'error',
      message: 'Error al actualizar un curso',
    } as const;
  }
}

/**
 * Endpoint for deleting a course by ID
 * @author Roberth
 * @param codigo
 */
export async function deleteCurso(codigo: string) {
  try {
    await deleteCursoFromDb(codigo);
    return {
      type: 'success',
      message: 'Curso eliminado exitosamente',
    } as const;
  } catch (error) {
    console.error('Error al eliminar un curso: ', error);
    return {
      type: 'error',
      message: 'Error al eliminar un curso',
    } as const;
  }
}
