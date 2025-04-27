import { count, desc, eq } from 'drizzle-orm';
import db from '../db';
import { empleados } from '../tables/empleados';
import { pagosNomina } from '../tables/pagosNomina';
import { usuarios } from '../tables/usuarios';
import { periodosNomina } from '../tables/periodoNomina';
import { getPrimaByName } from '../services/primas.server';
import { primasPagoNomina } from '../tables/primasPagoNomina';

/**
 * Get pagos with pagination, for table
 * @author gabrielm
 * @param page Current table page number
 * @param pageSize Number of records per page
 */
export async function getPagosNomina(page = 1, pageSize = 20) {
  try {
    const pagosQuery = db
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

    const totalRecords = db
      .select({ count: count(pagosNomina.id) })
      .from(pagosNomina)
      .then((res) => Number(res[0].count));

    const [pagosResult, total] = await Promise.all([pagosQuery, totalRecords]);

    const hasMorePages = page * pageSize < total;

    return {
      data: pagosResult,
      hasMorePages,
    };
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
export async function createPago(data: Record<string, string | number>) {
  try {
    const primaAntiguedad = Number(data.primaAntiguedad);
    const primaAcademica = Number(data.primaAcademica);
    const leyPoliticaHabitacionalFaov = Number(
      data.leyPoliticaHabitacionalFaov,
    );
    const descuentoSso = Number(data.descuentoSso);
    const descuentoSpf = Number(data.descuentoSpf);

    let totalAsignaciones = primaAntiguedad + primaAcademica;
    let totalAdicional = 0;
    const totalDeducciones =
      leyPoliticaHabitacionalFaov + descuentoSso + descuentoSpf;

    const primasAdicionales = [];
    for (const [name, value] of Object.entries(data)) {
      if (
        ![
          'periodoNominaId',
          'empleadoId',
          'cargoEmpleado',
          'sueldoBaseMensual',
          'registradoPorId',
          'primaAntiguedad',
          'primaAcademica',
          'leyPoliticaHabitacionalFaov',
          'descuentoSso',
          'descuentoSpf',
        ].includes(name)
      ) {
        // Acumular primas
        if (name.startsWith('Prima')) {
          totalAsignaciones += Number(value);
        } else {
          totalAdicional += Number(value);
        }
        // Obtener de la bd para asociar
        const primaFromDB = await getPrimaByName(name);
        if (primaFromDB && Number(value) > 0) {
          primasAdicionales.push({ id: primaFromDB.id, monto: Number(value) });
        }
      }
    }

    const sueldo = Number(data.sueldoBaseMensual);
    const totalNomina =
      sueldo + totalAsignaciones + totalAdicional - totalDeducciones;

    // Registrar pago
    const inserted = await db
      .insert(pagosNomina)
      .values({
        empleadoId: Number(data.empleadoId),
        periodoNominaId: Number(data.periodoNominaId),
        registradoPorId: Number(data.registradoPorId),
        cargoEmpleado: String(data.cargoEmpleado),
        sueldoBaseMensual: sueldo,
        primaAcademica,
        primaAntiguedad,
        leyPoliticaHabitacionalFaov,
        descuentoSpf,
        descuentoSso,
        totalAsignaciones,
        totalDeducciones,
        totalAdicional,
        totalNomina,
      })
      .returning({ id: pagosNomina.id });

    // Registrar primas del pago
    const pagoId = inserted[0].id;
    const primasPago = primasAdicionales.map((p) => ({
      idPago: pagoId,
      idPrima: p.id,
      monto: p.monto,
    }));
    await db.insert(primasPagoNomina).values(primasPago);

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
