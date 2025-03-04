import { eq, desc } from 'drizzle-orm';
import db from '../db';
import { estudiantes } from '../tables/estudiantes';
import {
  createEstudiante,
  deleteEstudianteFromDb,
  getSingleEstudiante,
  updateEstudianteInDb,
} from '../services/estudiantes.server';
import { EstudianteInsert, EstudianteUpdate } from '~/types/estudiantes.types';

/**
 * Get full list of students
 * @author Andrés
 */

export async function getEstudiantes() {
  try {
    const estudiantesList = await db
      .select()
      .from(estudiantes)
      .orderBy(desc(estudiantes.id));

    return estudiantesList;
  } catch (error) {
    console.error('Error al obtener a los estudiantes: ', error);
    return {
      type: 'error',
      message: 'Error al obtener a los estudiantes',
    } as const;
  }
}

/**
 * Get a single student by ID
 * @author Andrés
 * @param id
 */
export async function getEstudianteById(id: number) {
  try {
    return await getSingleEstudiante(id);
  } catch (error) {
    console.error('Error al obtener a un estudiante por id');
    return {
      type: 'error',
      message: 'Error al obtener a un estudiante por id',
    };
  }
}

/**
 * Endpoint for adding a student
 * @author Andrés
 */
export async function addEstudiante(data: EstudianteInsert) {
  try {
    const newEstudiante = await createEstudiante(data);
    return newEstudiante;
  } catch (error) {
    console.error('Error al añadir un estudiante: ', error);
    return {
      type: 'error',
      message: 'Error al añadir un estudiantee',
    } as const;
  }
}

/**
 * Endpoint for updating a student by ID
 * @author Andrés
 * @param id
 * @param data
 */
export async function updateEstudiante(id: number, data: EstudianteUpdate) {
  try {
    const updatedEstudiante = await updateEstudianteInDb(id, data);
    return updateEstudiante;
  } catch (error) {
    console.error('Error al actualizar un estudiante: ', error);
    return {
      type: 'error',
      message: 'Error al actualizar un estudiante',
    };
  }
}

/**
 * Endpoint for deleting an student by id
 * @author Andrés
 * @param id
 */
export const deleteEstudiante = async (id: number) => {
  try {
    await deleteEstudianteFromDb(id);
    return {
      type: 'success',
      message: 'Estudiante eliminado exitosamente',
    };
  } catch (error) {
    console.error('Error al eliminar estudiante: ', error);
    return {
      type: 'error',
      message: 'Error al eliminar un estudiante',
    } as const;
  }
};
