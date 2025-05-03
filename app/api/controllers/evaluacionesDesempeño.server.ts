import { count, desc, eq } from 'drizzle-orm';
import db from '../db';
import { empleados } from '../tables/empleados';
import { usuarios } from '../tables/usuarios';
import { evaluacionesDesempeño } from '../tables/evaluacionDesempeño';
import { periodosEvaluacionDesempeño } from '../tables/periodosEvaluacionDesempeño';
import { PagosEvaluacionDesempeñoInsert } from '~/types/pagosEvaluacionDesempeño.types';

/**
 * Get pagos with pagination, for table
 * @author gabrielm
 * @param page Current table page number
 * @param pageSize Number of records per page
 */
export async function getEvaluacionesDesempeño(page = 1, pageSize = 20) {
  try {
    const pagosQuery = db
      .select({
        id: evaluacionesDesempeño.id,
        periodo: periodosEvaluacionDesempeño.nombre,
        fecha: evaluacionesDesempeño.fecha,
        nombreEmpleado: empleados.nombreCompleto,
        montoFinal: evaluacionesDesempeño.montoFinal,
        nombreUsuario: usuarios.nombre,
      })
      .from(evaluacionesDesempeño)
      .innerJoin(
        periodosEvaluacionDesempeño,
        eq(evaluacionesDesempeño.periodoId, periodosEvaluacionDesempeño.id),
      )
      .innerJoin(empleados, eq(evaluacionesDesempeño.empleadoId, empleados.id))
      .innerJoin(
        usuarios,
        eq(evaluacionesDesempeño.registradoPorId, usuarios.id),
      )
      .orderBy(desc(evaluacionesDesempeño.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const totalRecords = db
      .select({ count: count(evaluacionesDesempeño.id) })
      .from(evaluacionesDesempeño)
      .then((res) => Number(res[0].count));

    const [pagosResult, total] = await Promise.all([pagosQuery, totalRecords]);

    const hasMorePages = page * pageSize < total;

    return {
      data: pagosResult,
      hasMorePages,
    };
  } catch (error) {
    console.error('Error fetching pagos de programa alimentario:', error);
    throw new Error('Error obteniendo pagos de programa alimentario');
  }
}

/**
 * Crear un nuevo pago
 * @author gabrielm
 * @param data
 */
export async function createEvaluacionDesempeño(
  data: PagosEvaluacionDesempeñoInsert,
) {
  try {
    await db.insert(evaluacionesDesempeño).values(data);
    return {
      type: 'success',
      message: 'Pago creado exitosamente',
    } as const;
  } catch (error) {
    console.error('Error creating pago:', error);
    return {
      type: 'error',
      message: 'Error creando pago',
    } as const;
  }
}

/**
 * Obtiene informacion de pago de evaluación de desempeño en formato para el exportador
 * @author gabrielm
 * @param id
 */
export async function getEvaluacionDesempeñoForExporter(id: number) {
  try {
    // Get data from pago
    const pagoQuery = await db
      .select({
        periodo: periodosEvaluacionDesempeño.nombre,
        fecha: evaluacionesDesempeño.fecha,
        nombreEmpleado: empleados.nombreCompleto,
        cedulaEmpleado: empleados.cedula,
        cargoEmpleado: evaluacionesDesempeño.cargoEmpleado,
        sueldoMensual: evaluacionesDesempeño.sueldoMensual,
        otrasPrimas: evaluacionesDesempeño.otrasPrimas,
        totalAsignacionesDiarias:
          evaluacionesDesempeño.totalAsignacionesDiarias,
        factorCalculo: evaluacionesDesempeño.factorCalculo,
        diasRangoObtenido: evaluacionesDesempeño.diasRangoObtenido,
        montoFinal: evaluacionesDesempeño.montoFinal,
        nombreCreador: usuarios.nombre,
      })
      .from(evaluacionesDesempeño)
      .innerJoin(empleados, eq(evaluacionesDesempeño.empleadoId, empleados.id))
      .innerJoin(
        periodosEvaluacionDesempeño,
        eq(evaluacionesDesempeño.periodoId, periodosEvaluacionDesempeño.id),
      )
      .innerJoin(
        usuarios,
        eq(evaluacionesDesempeño.registradoPorId, usuarios.id),
      )
      .where(eq(evaluacionesDesempeño.id, id))
      .limit(1);
    if (!pagoQuery.length) {
      return null;
    }
    const pago = pagoQuery[0];
    return pago;
  } catch (error) {
    console.error(error);
    return null;
  }
}
