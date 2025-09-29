import { eq } from 'drizzle-orm';
import db from '../db';
import { estudiantes } from '../tables/estudiantes';
import { EstudianteInsert, EstudianteUpdate } from '~/types/estudiantes.types';

/**
 * Gets a single student
 * @author Andréss
 * @param cedula
 * @throws if the student could not be selected
 */
export async function getSingleEstudiante(cedula: string) {
  const estudiante = await db
    .select()
    .from(estudiantes)
    .where(eq(estudiantes.cedula, cedula));

  return estudiante[0];
}

/**
 * Inserts a new student into de database
 * @author Andrés
 * @param data
 * @throws if the student could not be inserted
 */
export async function createEstudiante(data: EstudianteInsert) {
  const newEstudiante = await db.insert(estudiantes).values(data).returning();
  return newEstudiante[0];
}

/**
 * Updates a student in the database by ID
 * @author Andrés
 * @param cedula
 * @param data
 * @throws if the student could not be updated
 */
export async function updateEstudianteInDb(
  cedula: string,
  data: EstudianteUpdate,
) {
  const updatedEstudiante = await db
    .update(estudiantes)
    .set(data)
    .where(eq(estudiantes.cedula, cedula))
    .returning();

  return updatedEstudiante[0];
}

/**
 * Deletes a student from the database by ID
 * @author Andrés
 * @param cedula
 * @throws if the student could not be deleted
 */
export async function deleteEstudianteFromDb(cedula: string) {
  await db.delete(estudiantes).where(eq(estudiantes.cedula, cedula));
}
