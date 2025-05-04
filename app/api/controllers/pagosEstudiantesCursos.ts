import {
  registrarPagoEstudiante,
  obtenerHistorialPagosEstudiante,
  calcularDeudaEstudiante,
  eliminarPagoEstudiante,
} from '../services/pagosEstudiantesCurso';
import type {
  PagoEstudianteInsert,
  PagoEstudiante,
} from '~/types/pagosEstudiantesCurso.types';

/**
 * Registers a payment for a student in a course
 * @param data - Payment data
 * @returns A success or error message
 */
export async function registrarPago(
  data: PagoEstudianteInsert,
): Promise<{ type: 'success' | 'error'; message: string }> {
  try {
    await registrarPagoEstudiante(data);
    return { type: 'success', message: 'Pago registrado exitosamente' };
  } catch (error) {
    console.error('Error al registrar el pago:', error);
    return { type: 'error', message: 'No se pudo registrar el pago' };
  }
}

/**
 * Retrieves the payment history for a student in a course
 * @param idPeriodo - The ID of the period
 * @param codigoCurso - The course code
 * @param idEstudiante - The ID of the student
 * @returns The payment history or an error message
 */
export async function obtenerHistorialPagos({
  idPeriodo,
  codigoCurso,
  cedulaEstudiante,
}: {
  idPeriodo: number;
  codigoCurso: string;
  cedulaEstudiante: string;
}): Promise<PagoEstudiante[] | { type: 'error'; message: string }> {
  try {
    const historial = await obtenerHistorialPagosEstudiante({
      idPeriodo,
      codigoCurso,
      cedulaEstudiante,
    });
    return historial;
  } catch (error) {
    console.error('Error al obtener el historial de pagos:', error);
    return {
      type: 'error',
      message: 'No se pudo obtener el historial de pagos',
    };
  }
}

/**
 * Calculates the remaining debt for a student in a course
 * @param idPeriodo - The ID of the period
 * @param codigoCurso - The course code
 * @param cedulaEstudiante - The ID of the student
 * @returns The remaining debt or an error message
 */
export async function calcularDeuda({
  idPeriodo,
  codigoCurso,
  cedulaEstudiante,
}: {
  idPeriodo: number;
  codigoCurso: string;
  cedulaEstudiante: string;
}): Promise<
  { type: 'success'; deuda: number } | { type: 'error'; message: string }
> {
  try {
    const deuda = await calcularDeudaEstudiante({
      idPeriodo,
      codigoCurso,
      cedulaEstudiante,
    });
    return { type: 'success', deuda };
  } catch (error) {
    console.error('Error al calcular la deuda:', error);
    return { type: 'error', message: 'No se pudo calcular la deuda' };
  }
}

/**
 * Deletes a specific payment from the database
 * @param idPago - The ID of the payment
 * @returns A success or error message
 */
export async function eliminarPago(
  idPago: number,
): Promise<{ type: 'success' | 'error'; message: string }> {
  try {
    await eliminarPagoEstudiante(idPago);
    return { type: 'success', message: 'Pago eliminado exitosamente' };
  } catch (error) {
    console.error('Error al eliminar el pago:', error);
    return { type: 'error', message: 'No se pudo eliminar el pago' };
  }
}
