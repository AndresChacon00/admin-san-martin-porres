import { desc, eq } from 'drizzle-orm';
import db from '../db';
import { empleados } from '../tables/empleados';
import { pagosNomina } from '../tables/pagosNomina';
import { usuarios } from '../tables/usuarios';
import { periodosNomina } from '../tables/periodoNomina';
import { PagoInsert } from '~/types/pagosNomina.types';

/**
 * Get pagos with pagination, for table
 * @author gabrielm
 * @param page Current table page number
 * @param pageSize Number of records per page
 */
export async function getPagosNomina(page = 1, pageSize = 20) {
  try {
    const pagosQuery = await db
      .select({
        id: pagosNomina.id,
        periodoNomina: periodosNomina.nombre,
        fecha: pagosNomina.fecha,
        nombreEmpleado: empleados.nombreCompleto,
        totalNomina: pagosNomina.totalNomina,
        nombreUsuario: usuarios.nombre,
      })
      .from(pagosNomina)
      .innerJoin(
        periodosNomina,
        eq(pagosNomina.periodoNominaId, periodosNomina.id),
      )
      .innerJoin(empleados, eq(pagosNomina.empleadoId, empleados.id))
      .innerJoin(usuarios, eq(pagosNomina.registradoPorId, usuarios.id))
      .orderBy(desc(pagosNomina.id))
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
    await db.insert(pagosNomina).values({
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
