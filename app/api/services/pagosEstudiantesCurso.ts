import db from '../db';
import { pagosEstudiantesCurso } from '../tables/pagosEstudiantesCurso';
import { cursos } from '../tables/cursos';
import { estudiantesCursoPeriodo } from '../tables/estudiantesCursoPeriodo';
import { eq, and, desc, sum } from 'drizzle-orm';
import type {
  PagoEstudianteInsert,
  PagoEstudiante,
} from '~/types/pagosEstudiantesCurso.types';

/**
 * Registrar un nuevo pago para un estudiante en un curso.
 * @param data - Datos del pago
 */
export async function registrarPagoEstudiante(data: PagoEstudianteInsert) {
  await db.insert(pagosEstudiantesCurso).values(data);
}

/**
 * Obtener el historial de pagos de un estudiante en un curso específico.
 * @param idPeriodo - ID del periodo
 * @param codigoCurso - Código del curso
 * @param idEstudiante - ID del estudiante
 * @returns Historial de pagos
 */
export async function obtenerHistorialPagosEstudiante({
  idPeriodo,
  codigoCurso,
  cedulaEstudiante,
}: {
  idPeriodo: number;
  codigoCurso: string;
  cedulaEstudiante: string;
}): Promise<PagoEstudiante[]> {
  return await db
    .select()
    .from(pagosEstudiantesCurso)
    .where(
      and(
        eq(pagosEstudiantesCurso.idPeriodo, idPeriodo),
        eq(pagosEstudiantesCurso.codigoCurso, codigoCurso),
        eq(pagosEstudiantesCurso.cedulaEstudiante, cedulaEstudiante),
      ),
    )
    .orderBy(desc(pagosEstudiantesCurso.fecha));
}

/**
 * Calcular la deuda restante de un estudiante en un curso.
 * @param idPeriodo - ID del periodo
 * @param codigoCurso - Código del curso
 * @param idEstudiante - ID del estudiante
 * @returns Deuda restante
 */
export async function calcularDeudaEstudiante({
  idPeriodo,
  codigoCurso,
  cedulaEstudiante,
}: {
  idPeriodo: number;
  codigoCurso: string;
  cedulaEstudiante: string;
}): Promise<number> {
  const [curso] = await db
    .select({
      precioTotal: cursos.precioTotal,
    })
    .from(estudiantesCursoPeriodo)
    .innerJoin(cursos, eq(cursos.codigo, estudiantesCursoPeriodo.codigoCurso))
    .where(
      and(
        eq(estudiantesCursoPeriodo.idPeriodo, idPeriodo),
        eq(estudiantesCursoPeriodo.codigoCurso, codigoCurso),
        eq(estudiantesCursoPeriodo.cedulaEstudiante, cedulaEstudiante),
      ),
    );

  const [pagos] = await db
    .select({
      totalPagado: sum(pagosEstudiantesCurso.monto).as('totalPagado'),
    })
    .from(pagosEstudiantesCurso)
    .where(
      and(
        eq(pagosEstudiantesCurso.idPeriodo, idPeriodo),
        eq(pagosEstudiantesCurso.codigoCurso, codigoCurso),
        eq(pagosEstudiantesCurso.cedulaEstudiante, cedulaEstudiante),
      ),
    );

  if (!curso) {
    throw new Error(
      `No se encontró el curso con código ${codigoCurso} en el periodo ${idPeriodo}`,
    );
  }

  const totalPagado = pagos?.totalPagado || 0;
  const deuda = curso?.precioTotal - totalPagado;

  return deuda > 0 ? deuda : 0;
}

/**
 * Eliminar un pago específico de la base de datos.
 * @param idPago - ID del pago
 */
export async function eliminarPagoEstudiante(idPago: number) {
  await db
    .delete(pagosEstudiantesCurso)
    .where(eq(pagosEstudiantesCurso.idPago, idPago));
}
