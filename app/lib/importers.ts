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

  const empleados: EmpleadoInsert[] = excelContent.slice(1).map((row) => ({
    nombreCompleto: String(row[1]),
    cedula: String(row[2]),
    fechaNacimiento: new Date(String(row[3])),
    sexo: String(row[4]) as Sexo,
    estadoCivil: String(row[5]) as EstadoCivil,
    religion: String(row[6]),
    hijosMenoresSeis: row[7] === 'SI' ? 1 : 0,
    montoMensualGuarderia: row[9] === 'SI' ? Number(row[10]) : undefined,
    fechaIngresoAvec: new Date(String(row[11])),
    fechaIngresoPlantel: new Date(String(row[12])),
    titulo: String(row[13]),
    descripcionTitulo: row[14] !== 'Ninguno' ? String(row[14]) : undefined,
    mencionTitulo: row[15] !== 'Ninguno' ? String(row[15]) : undefined,
    carreraEstudiando: row[16] !== 'Ninguno' ? String(row[16]) : undefined,
    tipoLapsoEstudios: row[17] !== 'Ninguno' ? String(row[17]) : undefined,
    numeroLapsosAprobados: row[18] !== 'Ninguno' ? Number(row[18]) : undefined,
    postgrado: row[19] !== 'Ninguno' ? String(row[19]) : undefined,
    experienciaLaboral: Number(row[21]),
    gradoSistema: String(row[22]),
    nivelSistema: String(row[23]),
    gradoCentro: String(row[24]),
    nivelCentro: String(row[25]),
    cargo: String(row[26]),
    horasSemanales: Number(row[28]),
    sueldo: Number(row[29]),
    asignacionesMensual: Number(row[31]),
    deduccionesMensual: Number(row[32]),
    primaAntiguedad: Number(row[33]),
    primaGeografica: row[35] === 'SI' ? Number(row[36]) : undefined,
    primaCompensacionAcademica: Number(row[38]),
    cantidadHijos: row[40] === 'SI' ? Number(row[41]) : 0,
    primaAsistencial: Number(row[44]),
    contribucionDiscapacidad: Number(row[46]),
    contribucionDiscapacidadHijos: Number(row[47]),
    porcentajeSso: row[48] === 'SI' ? Number(row[49]) : undefined,
    porcentajeRpe: Number(row[50]),
    porcentajeFaov: row[51] === 'SI' ? Number(row[52]) : undefined,
    pagoDirecto: row[53] === 'SI',
    jubilado: row[54] === 'SI',
    cuentaBancaria: String(row[55]),
    observaciones: String(row[56] ?? ''),
    fechaRegistro: new Date(String(row[57])),
    fechaActualizacion: new Date(String(row[58])),
  }));

  return empleados;
}
