import { read, utils as SheetUtils } from 'xlsx';
import type {
  EstadoCivil,
  Sexo,
  EmpleadoInsert,
} from '~/types/empleados.types';

/**
 * Imports a list of employees from an Excel file
 * @author gabrielm
 * @param file
 */
export function importEmpleados(file: ArrayBuffer) {
  const workbook = read(file, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelContent = SheetUtils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
  });

  const parseNumber = (value: unknown, defaultValue = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : defaultValue;
  };

  const parseDate = (value: unknown) => {
    const date = new Date(String(value));
    return isNaN(date.getTime()) ? null : date;
  };

  const empleados: EmpleadoInsert[] = excelContent.slice(1).map((row) => ({
    nombreCompleto: String(row[1]),
    cedula: String(row[2]),
    fechaNacimiento: parseDate(row[3]) ?? new Date(0),
    sexo: String(row[4]) as Sexo,
    estadoCivil: String(row[5]) as EstadoCivil,
    religion: String(row[6]),
    hijosMenoresSeis: row[7] === 'SI' ? 1 : 0,
    montoMensualGuarderia: row[9] === 'SI' ? parseNumber(row[10], undefined) : undefined,
    fechaIngresoAvec: parseDate(row[11]) ?? new Date(0),
    fechaIngresoPlantel: parseDate(row[12]) ?? new Date(0),
    titulo: String(row[13]),
    descripcionTitulo: row[14] !== 'Ninguno' ? String(row[14]) : undefined,
    mencionTitulo: row[15] !== 'Ninguno' ? String(row[15]) : undefined,
    carreraEstudiando: row[16] !== 'Ninguno' ? String(row[16]) : undefined,
    tipoLapsoEstudios: row[17] !== 'Ninguno' ? String(row[17]) : undefined,
    numeroLapsosAprobados: row[18] !== 'Ninguno' ? parseNumber(row[18], undefined) : undefined,
    postgrado: row[19] !== 'Ninguno' ? String(row[19]) : undefined,
    experienciaLaboral: parseNumber(row[21]),
    gradoSistema: String(row[22]),
    nivelSistema: String(row[23]),
    gradoCentro: String(row[24]),
    nivelCentro: String(row[25]),
    cargo: String(row[26]),
    horasSemanales: parseNumber(row[28]),
    sueldo: parseNumber(row[29]),
    asignacionesMensual: parseNumber(row[31]),
    deduccionesMensual: parseNumber(row[32]),
    primaAntiguedad: parseNumber(row[33]),
    primaGeografica: row[35] === 'SI' ? parseNumber(row[36], undefined) : undefined,
    primaCompensacionAcademica: parseNumber(row[38]),
    cantidadHijos: row[40] === 'SI' ? parseNumber(row[41]) : 0,
    primaAsistencial: parseNumber(row[44]),
    contribucionDiscapacidad: parseNumber(row[46]),
    contribucionDiscapacidadHijos: parseNumber(row[47]),
    porcentajeSso: row[48] === 'SI' ? parseNumber(row[49], undefined) : undefined,
    porcentajeRpe: parseNumber(row[50]),
    porcentajeFaov: row[51] === 'SI' ? parseNumber(row[52], undefined) : undefined,
    pagoDirecto: row[53] === 'SI',
    jubilado: row[54] === 'SI',
    cuentaBancaria: String(row[55]),
    observaciones: String(row[56] ?? ''),
    fechaRegistro: parseDate(row[57]) ?? new Date(0),
    fechaActualizacion: parseDate(row[58]) ?? new Date(0),
  }));

  return empleados;
}
