import db from '../db';
import { profesores } from '../tables/profesores';
import { empleados } from '../tables/empleados';
import type { EmpleadoInsert, EmpleadoUpdate } from '~/types/empleados.types';
import { eq, inArray } from 'drizzle-orm';
import {
  createEmpleado,
  getSingleEmpleado,
  updateEmpleadoInDb,
} from '../services/empleados.server';

/**
 * Get full list of teachers
 * @author Bertorelli
 */
export const getProfesores = async () => {
  try {
    const profesoresList = await db
      .select({
        id: profesores.id,
      })
      .from(profesores)
      .orderBy(profesores.id);

    const empleadosList = await db
      .select()
      .from(empleados)
      .orderBy(empleados.id)
      .where(
        inArray(
          empleados.id,
          profesoresList.map((p) => p.id),
        ),
      );

    return empleadosList;
  } catch (error) {
    console.error('Error al obtener a los profesores: ', error);
    return { type: 'error', message: 'Error al obtener profesores' } as const;
  }
};

/**
 * Get teacher by ID
 * @author Bertorelli
 */
export const getProfesorById = async (id: number) => {
  try {
    return await getSingleEmpleado(id);
  } catch (error) {
    console.error('Error al obtener profesor: ', error);
    return { type: 'error', message: 'Error al obtener profesor' } as const;
  }
};

/**
 * Add a teacher
 * @author Bertorelli
 * @param data
 */
export const addProfesor = async (data: EmpleadoInsert) => {
  try {
    const existingEmpleado = await db
      .select()
      .from(empleados)
      .where(eq(empleados.cedula, data.cedula))
      .limit(1);
    
    let empleadoId;
    if (existingEmpleado.length > 0) {
      empleadoId = existingEmpleado[0].id;
    } else {
      const newEmpleado = await createEmpleado(data);
      empleadoId = newEmpleado.id;
    }

    await db.insert(profesores).values({ id: empleadoId }).returning();

    return { type: 'success', message: 'Profesor creado con éxito' } as const;
  } catch (error) {
    console.error('Error al añadir un profesor: ', error);
    return { type: 'error', message: 'Error al añadir un profesor' } as const;
  }
};

/**
 * Remove a teacher
 * @author Bertorelli
 * @param id
 */
export const deleteProfesor = async (id: number) => {
  try {
    await db.delete(profesores).where(eq(profesores.id, id)).returning();
    await db.delete(empleados).where(eq(empleados.id, id)).returning();
    return {
      type: 'success',
      message: 'Profesor eliminado con éxito',
    } as const;
  } catch (error) {
    console.error('Error al eliminar un profesor: ', error);
    return { type: 'error', message: 'Error al eliminar el profesor' } as const;
  }
};

/**
 * Update a teacher
 * @author Bertorelli
 * @param id
 * @param data
 */
export const updateProfesor = async (id: number, data: EmpleadoUpdate) => {
  try {
    const updated = updateEmpleadoInDb(id, data);
    return updated;
  } catch (error) {
    console.error('Error al actualizar el profesor: ', error);
    return { type: 'error', message: 'Error al actualizar el profesor' };
  }
};
