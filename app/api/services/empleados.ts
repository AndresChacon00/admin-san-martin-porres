import type { EmpleadoInsert, EmpleadoUpdate } from '~/types/empleados.types';
import db from '../db';
import { empleados } from '../tables/empleados';
import { eq } from 'drizzle-orm';

/**
 * Gets a single employee
 * @author Gabriel
 * @param id
 * @throws if the employee could not be selected
 */
export async function getSingleEmpleado(id: number) {
  const empleado = await db
    .select()
    .from(empleados)
    .where(eq(empleados.id, id));

  return empleado[0];
}

/**
 * Insert a new employee into the database
 * @author Gabriel
 * @param data
 * @throws if the employee could not be inserted
 */
export async function createEmpleado(data: EmpleadoInsert) {
  const newEmpleado = await db.insert(empleados).values(data).returning();
  return newEmpleado[0];
}

/**
 * Updates an employee in the database by ID
 * @author Gabriel
 * @param id
 * @param data
 * @throws if the employee could not be updated
 */
export async function updateEmpleadoInDb(id: number, data: EmpleadoUpdate) {
  const updatedEmpleado = await db
    .update(empleados)
    .set(data)
    .where(eq(empleados.id, id))
    .returning();
  return updatedEmpleado[0];
}

/**
 * Deletes an employee in the database by ID
 * @author Gabriel
 * @param id
 * @throws if the employee could not be deleted
 */
export async function deleteEmpleadoFromDb(id: number) {
  await db.delete(empleados).where(eq(empleados.id, id));
}
