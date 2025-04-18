import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { empleados } from './empleados';
import { periodosNomina } from './periodoNomina';
import { usuarios } from './usuarios';

export const pagos = sqliteTable('pagos', {
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
  primaPorHijo: real('prima_por_hijo').notNull(),
  primaCompensatoria: real('prima_compensatoria').notNull(),
  bonoNocturno: real('bono_nocturno').notNull().default(0),
  horasExtrasNocturnas: real('horas_extras_nocturnas').notNull().default(0),
  horasExtrasDiurnas: real('horas_extras_diurnas').notNull().default(0),
  feriadosTrabajados: real('feriados_trabajados').notNull().default(0),
  retroactivos: real('retroactivos').notNull().default(0),
  leyPoliticaHabitacionalFaov: real('ley_politica_habitacional_faov').notNull(),
  descuentoSso: real('descuento_sso').notNull(),
  descuentoSpf: real('descuento_spf').notNull(),
});
