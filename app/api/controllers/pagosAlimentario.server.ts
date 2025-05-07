import { count, desc, eq } from 'drizzle-orm';
import db from '../db';
import { empleados } from '../tables/empleados';
import { usuarios } from '../tables/usuarios';
import { periodosAlimentario } from '../tables/periodosAlimentario';
import { pagosAlimentario } from '../tables/pagosAlimentario';
import { PagoAlimentarioInsert } from '~/types/pagosAlimentario.types';

/**
 * Get pagos with pagination, for table
 * @author gabrielm
 * @param page Current table page number
 * @param pageSize Number of records per page
 */
export async function getPagosAlimentario(page = 1, pageSize = 20) {
  try {
    const pagosQuery = db
      .select({
        id: pagosAlimentario.id,
        periodoAlimentario: periodosAlimentario.nombre,
        fecha: pagosAlimentario.fecha,
        nombreEmpleado: empleados.nombreCompleto,
        totalARecibir: pagosAlimentario.totalARecibir,
        nombreUsuario: usuarios.nombre,
      })
      .from(pagosAlimentario)
      .innerJoin(
        periodosAlimentario,
        eq(pagosAlimentario.periodoAlimentarioId, periodosAlimentario.id),
      )
      .innerJoin(empleados, eq(pagosAlimentario.empleadoId, empleados.id))
      .innerJoin(usuarios, eq(pagosAlimentario.registradoPorId, usuarios.id))
      .orderBy(desc(pagosAlimentario.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const totalRecords = db
      .select({ count: count(pagosAlimentario.id) })
      .from(pagosAlimentario)
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
export async function createPagoAlimentario(data: PagoAlimentarioInsert) {
  try {
    await db.insert(pagosAlimentario).values(data);
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
 * Obtiene informacion de pago de programa alimentario en formato para el exportador
 * @author gabrielm
 * @param id
 */
export async function getPagoAlimentarioForExporter(id: number) {
  try {
    // Get data from pago
    const pagoQuery = await db
      .select({
        fecha: pagosAlimentario.fecha,
        nombreEmpleado: empleados.nombreCompleto,
        cedulaEmpleado: empleados.cedula,
        cargoEmpleado: pagosAlimentario.cargoEmpleado,
        periodoAlimentario: periodosAlimentario.nombre,
        horasSemanales: pagosAlimentario.horasSemanales,
        totalBeneficio: pagosAlimentario.totalBeneficio,
        descuentoInasistencia: pagosAlimentario.descuentoInasistencia,
        totalARecibir: pagosAlimentario.totalARecibir,
        nombreCreador: usuarios.nombre,
      })
      .from(pagosAlimentario)
      .innerJoin(empleados, eq(pagosAlimentario.empleadoId, empleados.id))
      .innerJoin(
        periodosAlimentario,
        eq(pagosAlimentario.periodoAlimentarioId, periodosAlimentario.id),
      )
      .innerJoin(usuarios, eq(pagosAlimentario.registradoPorId, usuarios.id))
      .where(eq(pagosAlimentario.id, id))
      .limit(1);
    if (!pagoQuery.length) {
      console.log('not found pagoQuery');
      return null;
    }
    const pago = pagoQuery[0];
    return pago;
  } catch (error) {
    console.error(error);
    return null;
  }
}
