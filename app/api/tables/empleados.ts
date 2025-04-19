import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { titulos } from './titulos';
import { grados } from './grados';
import { niveles } from './niveles';
import { cargos } from './cargos';

export const empleados = sqliteTable('empleados', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  cedula: text().notNull().unique(),
  nombreCompleto: text().notNull(),
  fechaNacimiento: integer({ mode: 'timestamp' }).notNull(),
  sexo: text({ enum: ['F', 'M'] }).notNull(),
  estadoCivil: text({ enum: ['S', 'C', 'D', 'V', 'R'] }).notNull(),
  religion: text().notNull(),
  hijosMenoresSeis: integer({ mode: 'number' }).default(0).notNull(),
  montoMensualGuarderia: real().default(0).notNull(),
  fechaIngresoAvec: integer({ mode: 'timestamp' }).notNull(),
  fechaIngresoPlantel: integer({ mode: 'timestamp' }).notNull(),
  titulo: integer({ mode: 'number' })
    .notNull()
    .references(() => titulos.id, { onDelete: 'no action' }),
  descripcionTitulo: text(),
  mencionTitulo: text(),
  carreraEstudiando: text(),
  tipoLapsoEstudios: text(),
  numeroLapsosAprobados: integer({ mode: 'number' }),
  postgrado: text({
    enum: ['POSTGRADO EN ESPECIALIDAD', 'MAESTRIA', 'DOCTORADO'],
  }),
  experienciaLaboral: integer({ mode: 'number' }).default(0).notNull(),
  gradoSistema: integer({ mode: 'number' })
    .notNull()
    .references(() => grados.id, { onDelete: 'no action' }),
  nivelSistema: integer({ mode: 'number' })
    .notNull()
    .references(() => niveles.id, { onDelete: 'no action' }),
  gradoCentro: integer({ mode: 'number' })
    .notNull()
    .references(() => grados.id, { onDelete: 'no action' }),
  nivelCentro: integer({ mode: 'number' })
    .notNull()
    .references(() => niveles.id, { onDelete: 'no action' }),
  cargo: integer({ mode: 'number' })
    .notNull()
    .references(() => cargos.id, { onDelete: 'no action' }),
  horasSemanales: real().notNull(),
  sueldo: real().notNull(),
  cantidadHijos: integer({ mode: 'number' }).notNull(),
  contribucionDiscapacidad: real().default(0).notNull(),
  contribucionDiscapacidadHijos: real().default(0).notNull(),
  pagoDirecto: integer({ mode: 'boolean' }).notNull(),
  jubilado: integer({ mode: 'boolean' }).notNull(),
  cuentaBancaria: text().notNull(),
  observaciones: text(),
  fechaRegistro: integer({ mode: 'timestamp_ms' }).defaultNow().notNull(),
  fechaActualizacion: integer({ mode: 'timestamp_ms' }).defaultNow().notNull(),
});
