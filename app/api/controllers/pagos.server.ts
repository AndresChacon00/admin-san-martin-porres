import { desc, eq } from 'drizzle-orm';
import db from '../db';
import { empleados } from '../tables/empleados';
import { pagos } from '../tables/pagos';
import { usuarios } from '../tables/usuarios';
import { periodosNomina } from '../tables/periodoNomina';
import { PagoInsert } from '~/types/pagos.types';

/**
 * Get pagos with pagination, for table
 * @author gabrielm
 * @param page Current table page number
 * @param pageSize Number of records per page
 */
export async function getPagos(page = 1, pageSize = 20) {
  try {
    const pagosQuery = await db
      .select({
        id: pagos.id,
        periodoNomina: periodosNomina.nombre,
        fecha: pagos.fecha,
        nombreEmpleado: empleados.nombreCompleto,
        totalNomina: pagos.totalNomina,
        nombreUsuario: usuarios.nombre,
      })
      .from(pagos)
      .innerJoin(periodosNomina, eq(pagos.periodoNominaId, periodosNomina.id))
      .innerJoin(empleados, eq(pagos.empleadoId, empleados.id))
      .innerJoin(usuarios, eq(pagos.registradoPorId, usuarios.id))
      .orderBy(desc(pagos.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    return pagosQuery;
  } catch (error) {
    console.error('Error fetching pagos:', error);
    throw new Error('Error obteniendo pagos');
  }
}

/**
 * Crear un nuevo pago
 * @author gabrielm
 * @param data
 */
export async function createPago(
  data: Omit<
    PagoInsert,
    'totalNomina' | 'totalAsignaciones' | 'totalDeducciones' | 'totalAdicional'
  >,
) {
  try {
    const totalAsignaciones =
      data.primaAcademica +
      data.primaAntiguedad +
      data.primaPorHijo +
      data.primaCompensatoria;
    const totalAdicional =
      (data.bonoNocturno || 0) +
      (data.horasExtrasNocturnas || 0) +
      (data.horasExtrasDiurnas || 0) +
      (data.feriadosTrabajados || 0) +
      (data.retroactivos || 0);
    const totalDeducciones =
      data.leyPoliticaHabitacionalFaov + data.descuentoSso + data.descuentoSpf;
    const totalNomina = totalAsignaciones + totalAdicional - totalDeducciones;
    await db.insert(pagos).values({
      ...data,
      totalAsignaciones,
      totalDeducciones,
      totalAdicional,
      totalNomina,
    });
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
