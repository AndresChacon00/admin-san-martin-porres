import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { empleados } from './empleados';
import { periodosNomina } from './periodoNomina';
import { usuarios } from './usuarios';

export const pagosNomina = sqliteTable('pagos_nomina', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  empleadoId: integer({ mode: 'number' })
    .notNull()
    .references(() => empleados.id, { onDelete: 'restrict' }),
  periodoNominaId: integer({ mode: 'number' })
    .notNull()
    .references(() => periodosNomina.id, { onDelete: 'cascade' }),
  registradoPorId: integer({ mode: 'number' })
    .notNull()
    .references(() => usuarios.id, { onDelete: 'restrict' }),
  fecha: integer({ mode: 'timestamp' }).notNull().defaultNow(),
  cargoEmpleado: text('cargo_empleado').notNull(),
  sueldoBaseMensual: real('sueldo_base_mensual').notNull(),
  primaAntiguedad: real('prima_antiguedad').notNull(),
  primaAcademica: real('prima_academica').notNull(),
  totalAsignaciones: real('total_asignaciones').notNull(),
  totalAdicional: real('total_adicional').notNull(),
  leyPoliticaHabitacionalFaov: real('ley_politica_habitacional_faov').notNull(),
  descuentoSso: real('descuento_sso').notNull(),
  descuentoSpf: real('descuento_spf').notNull(),
  totalDeducciones: real('total_deducciones').notNull(),
  totalNomina: real('total_nomina').notNull(),
});
