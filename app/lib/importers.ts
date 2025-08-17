import { read, utils as SheetUtils } from 'xlsx';
import type {
  EstadoCivil,
  Sexo,
  NivelAcademico,
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
    if (typeof value === 'number') {
      // Excel serial date: days since 1899-12-31
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      return new Date(excelEpoch.getTime() + value * 86400000);
    }
    const date = new Date(String(value));
    return isNaN(date.getTime()) ? null : date;
  };

  const empleados = excelContent.slice(1).map((row) => ({
    nombreCompleto: String(row[0]),
    cedula: String(row[1]),
    fechaNacimiento: parseDate(row[2]) ?? new Date(0),
    sexo: String(row[3]) as Sexo,
    estadoCivil: String(row[4]) as EstadoCivil,
    religion: String(row[5]),
    hijosMenoresSeis: parseNumber(row[6]),
    montoMensualGuarderia: parseNumber(row[7]),
    fechaIngresoAvec: parseDate(row[8]) ?? new Date(0),
    fechaIngresoPlantel: parseDate(row[9]) ?? new Date(0),
    titulo: String(row[10]),
    descripcionTitulo: row[11] !== 'Ninguno' ? String(row[11]) : undefined,
    mencionTitulo: row[12] !== 'Ninguno' ? String(row[12]) : undefined,
    carreraEstudiando: row[13] !== 'Ninguno' ? String(row[13]) : undefined,
    tipoLapsoEstudios: row[14] !== 'Ninguno' ? String(row[14]) : undefined,
    numeroLapsosAprobados:
      row[15] !== 'Ninguno' ? parseNumber(row[15], 0) : undefined,
    postgrado:
      row[16] !== 'Ninguno' ? (String(row[16]) as NivelAcademico) : undefined,
    experienciaLaboral: parseNumber(row[17]),
    gradoSistema: String(row[18]),
    nivelSistema: String(row[19]),
    gradoCentro: String(row[20]),
    nivelCentro: String(row[21]),
    cargo: String(row[22]),
    horasSemanales: parseNumber(row[23]),
    sueldo: parseNumber(row[24]),
    cantidadHijos: parseNumber(row[25]),
    contribucionDiscapacidad: parseNumber(row[26]),
    contribucionDiscapacidadHijos: parseNumber(row[27]),
    pagoDirecto: row[28] === 'SI',
    jubilado: row[29] === 'SI',
    cuentaBancaria: String(row[30]),
    observaciones: String(row[31] ?? ''),
    fechaRegistro: parseDate(row[32]) ?? new Date(0),
    fechaActualizacion: parseDate(row[33]) ?? new Date(0),
  }));

  return empleados;
}
