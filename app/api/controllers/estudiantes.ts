import { eq } from 'drizzle-orm';
import db from '../db';
import { estudiantes } from '../tables/estudiantes';

export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  sexo: string;
  fechaNacimiento: Date;
  edad: number;
  religion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ultimoAñoCursado: string;
}
/**
 * Get full list of students
 * @author Andrés Chacón
 */

export const getEstudiantes = async () => {
  try {
    const estudiantesList = await db
      .select()
      .from(estudiantes)
      .orderBy(estudiantes.id);

    return estudiantesList;
  } catch (error) {
    console.error('Error al obtener a los estudiantes: ', error);
    return {
      type: 'error',
      message: 'Error al obtener a los empleados',
    } as const;
  }
};

/**
 * Endpoint for adding a student
 * @author Andrés Chacón
 */
export const addEstudiante = async (
  nombre: string,
  apellido: string,
  cedula: string,
  sexo: string,
  fechaNacimiento: Date,
  edad: number,
  religion: string,
  telefono: string,
  correo: string,
  direccion: string,
  ultimoAñoCursado: string,
) => {
  try {
    const newEstudiante = await db
      .insert(estudiantes)
      .values({
        nombre,
        apellido,
        cedula,
        sexo,
        fechaNacimiento,
        edad,
        religion,
        telefono,
        correo,
        direccion,
        ultimoAñoCursado,
      })
      .returning();

    return newEstudiante[0];
  } catch (error) {
    console.error('Error al añadir un estudiante: ', error);
    return {
      type: 'error',
      message: 'Error al añadir un estudiante',
    } as const;
  }
};

/**
 * Endpoint for deleting an student by id
 * @author Andrés Chacón
 * @param id
 */
export const deleteEstudiante = async (id: number) => {
  try {
    await db.delete(estudiantes).where(eq(estudiantes.id, id));
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
