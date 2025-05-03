import { desc, eq, notExists } from 'drizzle-orm';
import db from '../db';
import { empleados } from '../tables/empleados';
import type { EmpleadoInsert, EmpleadoUpdate } from '~/types/empleados.types';
import {
  createEmpleado,
  deleteEmpleadoFromDb,
  getSingleEmpleado,
  updateEmpleadoInDb,
} from '../services/empleados.server';
import { profesores } from '../tables/profesores';
import { titulos } from '../tables/titulos';

/**
 * Get full list of employees
 * @author Gabriel
 */
export async function getEmpleados() {
  try {
    const empleadosList = await db
      .select()
      .from(empleados)
      .where(
        notExists(
          db.select().from(profesores).where(eq(profesores.id, empleados.id)),
        ),
      )
      .orderBy(desc(empleados.id));
    return empleadosList;
  } catch (error) {
    console.error('Error al obtener a los empleados: ', error);
    return {
      type: 'error',
      message: 'Error al obtener a los empleados',
    } as const;
  }
}

/**
 * Get single employee by ID
 * @author Gabriel
 * @param id
 */
export async function getEmpleadoById(id: number) {
  try {
    return await getSingleEmpleado(id);
  } catch (error) {
    console.error('Error al obtener a un empleado por ID: ', error);
    return {
      type: 'error',
      message: 'Error al obtener a un empleado por ID',
    } as const;
  }
}

/**
 * Endpoint for adding an employee
 * @author Gabriel
 * @param data
 */
export async function addEmpleado(data: EmpleadoInsert) {
  try {
    await createEmpleado(data);
    return { type: 'success', message: 'Empleado creado con éxito' } as const;
  } catch (error) {
    console.error('Error al añadir un empleado: ', error);
    return {
      type: 'error',
      message: 'Error al añadir un empleado',
    } as const;
  }
}

/**
 * Endpoint for updating an employee by ID
 * @author Gabriel
 * @param id
 * @param data
 */
export async function updateEmpleado(id: number, data: EmpleadoUpdate) {
  try {
    await updateEmpleadoInDb(id, data);
    return {
      type: 'success',
      message: 'Empleado actualizado con éxito',
    } as const;
  } catch (error) {
    console.error('Error al actualizar un empleado: ', error);
    return {
      type: 'error',
      message: 'Error al actualizar un empleado',
    } as const;
  }
}

/**
 * Endpoint for deleting an employee by ID
 * @author Gabriel
 * @param id
 */
export async function deleteEmpleado(id: number) {
  try {
    await deleteEmpleadoFromDb(id);
    return {
      type: 'success',
      message: 'Empleado eliminado exitosamente',
    } as const;
  } catch (error) {
    console.error('Error al eliminar un empleado: ', error);
    return {
      type: 'error',
      message: 'Error al eliminar un empleado',
    } as const;
  }
}

/**
 * Get employees for payroll
 * @author Gabriel
 */
export async function getEmpleadosForNomina() {
  try {
    return await db
      .select({
        id: empleados.id,
        cedula: empleados.cedula,
        nombre: empleados.nombreCompleto,
        sueldo: empleados.sueldo,
        fechaIngresoAvec: empleados.fechaIngresoAvec,
        titulo: titulos.nombre,
        nivelAcademico: empleados.postgrado,
        hijos: empleados.cantidadHijos,
      })
      .from(empleados)
      .innerJoin(titulos, eq(titulos.id, empleados.titulo));
  } catch (error) {
    console.error('Error al obtener a los empleados para nómina: ', error);
    throw new Error('Error al obtener a los empleados para nómina');
  }
}

/**
 * Gets empleado data for programa alimentario
 * @author gabrielm
 */
export async function getEmpleadosForProgramaAlimentario() {
  try {
    return await db
      .select({
        id: empleados.id,
        cedula: empleados.cedula,
        nombre: empleados.nombreCompleto,
        horasSemanales: empleados.horasSemanales,
      })
      .from(empleados);
  } catch (error) {
    console.error(
      'Error al obtener a los empleados para programa alimentario: ',
      error,
    );
    throw new Error(
      'Error al obtener a los empleados para programa alimentario',
    );
  }
}
