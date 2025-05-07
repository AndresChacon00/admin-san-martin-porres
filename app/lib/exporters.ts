import { type Empleado } from '~/types/empleados.types';
import { utils as SheetUtils, writeFile } from 'xlsx';
import { PagoNominaExportar } from '~/types/pagosNomina.types';
import { ADDRESS, EXCEL_COLS, FOUNDATION_NAME, RIF } from '~/constants';
import { PagoAlimentarioExportar } from '~/types/pagosAlimentario.types';
import { EvaluacionDesempeñoExportar } from '~/types/pagosEvaluacionDesempeño.types';

/**
 * Exports a list of employees into an Excel file
 * @param empleados
 */
export function exportEmpleados(empleados: Empleado[]) {
  const excelContent = [
    [
      'Centro',
      'Apellidos y Nombres',
      'Identificación',
      'Fecha de Nacimiento',
      'Sexo',
      'Estado Civil',
      'Religión',
      'Tiene hijos menores de 6 años de edad',
      'Número de hijos menores de 6 años de edad',
      'Beneficio de guardería',
      'Monto mensual que paga el plantel por guardería',
      'Fecha de ingreso en Centros AVEC',
      'Fecha de ingreso al Plantel',
      'Título',
      'Descripción del Título Académico Obtenido',
      'Mención del Título Académico Obtenido',
      'Carrera que está estudiando',
      'Número de Lapso Académico Aprobado',
      'Postgrado',
      'Tiempo de servicio AVEC',
      'Experiencia Laboral',
      'Grado SISTEMA',
      'Nivel SISTEMA',
      'Grado Centro',
      'Nivel Centro',
      'Cargo',
      'Tiempo en el Cargo',
      'Horas semanales',
      'Sueldo según clasificación',
      'Sueldo SISTEMA',
      'Sueldo Centro',
      'Asignaciones mensual',
      'Deducciones mensual',
      'Prima Antigüedad',
      'Prima Antigüedad según SISTEMA',
      'Beneficio Geográfica',
      'Prima Geográfica',
      'Prima Geográfica según SISTEMA',
      'Prima Compensación Académica',
      'Prima Compensación Académica según SISTEMA',
      'Beneficio de prima por hijo',
      'Cantidad de hijos',
      'Prima por Hijo',
      'Prima por Hijo según SISTEMA',
      'Prima Asistencial',
      'Prima Compensatoria',
      'Contribución por discapacidad',
      'Contribución por discapacidad de hijos',
      'Seguro Social-Regimen prestacional de empleo',
      'Porcentaje SSO',
      'Porcentaje RPE',
      'FAOV',
      'Porcentaje FAOV',
      'Pago directo',
      'Jubilado',
      'Cuenta Bancaria',
      'Observaciones',
      'fecha de registro',
      'fecha de actualización',
    ],
    ...empleados.map((empleado) => [
      '11C058',
      empleado.nombreCompleto,
      empleado.cedula,
      new Date(empleado.fechaNacimiento).toLocaleDateString(),
      empleado.sexo,
      empleado.estadoCivil,
      empleado.religion,
      empleado.hijosMenoresSeis ? 'SI' : 'NO',
      empleado.hijosMenoresSeis,
      empleado.montoMensualGuarderia ? 'SI' : 'NO',
      empleado.montoMensualGuarderia,
      new Date(empleado.fechaIngresoAvec).toLocaleDateString(),
      new Date(empleado.fechaIngresoPlantel).toLocaleDateString(),
      empleado.titulo,
      empleado.descripcionTitulo ?? 'Ninguno',
      empleado.mencionTitulo ?? 'Ninguno',
      empleado.carreraEstudiando ?? 'Ninguno',
      empleado.tipoLapsoEstudios ?? 'Ninguno',
      empleado.numeroLapsosAprobados ?? 'Ninguno',
      empleado.postgrado ?? 'Ninguno',
      new Date().getFullYear() -
        new Date(empleado.fechaIngresoAvec).getFullYear(),
      empleado.experienciaLaboral,
      empleado.gradoSistema,
      empleado.nivelSistema,
      empleado.gradoCentro,
      empleado.nivelCentro,
      empleado.cargo,
      new Date().getFullYear() -
        new Date(empleado.fechaIngresoPlantel).getFullYear(),
      empleado.horasSemanales,
      empleado.sueldo,
      empleado.sueldo,
      empleado.sueldo,
      empleado.cantidadHijos ? 'SI' : 'NO',
      empleado.cantidadHijos,
      empleado.cantidadHijos * 12.5,
      empleado.cantidadHijos * 12.5,
      0,
      empleado.contribucionDiscapacidad,
      empleado.contribucionDiscapacidadHijos,
      empleado.pagoDirecto ? 'SI' : 'NO',
      empleado.jubilado ? 'SI' : 'NO',
      empleado.cuentaBancaria,
      empleado.observaciones ?? '',
      empleado.fechaRegistro,
      empleado.fechaActualizacion,
    ]),
  ];

  const worksheet = SheetUtils.aoa_to_sheet(excelContent);
  const workbook = SheetUtils.book_new();
  SheetUtils.book_append_sheet(workbook, worksheet, 'Empleados');
  return workbook;
}

/**
 * Genera el recibo en excel para un pago de nómina
 * @author gabrielm
 * @param pago
 */
export function generarReciboNomina(pago: PagoNominaExportar) {
  const excelContent = [
    [FOUNDATION_NAME, '', '', `RIF: ${RIF}`],
    [
      `DIRECCION: ${ADDRESS}`,
      '',
      '',
      '',
      '',
      `FECHA: ${pago.fecha.toLocaleDateString()}`,
    ],
    [
      'APELLIDO Y NOMBRE:',
      '',
      pago.nombreEmpleado.toUpperCase(),
      '',
      pago.cedulaEmpleado,
    ],
    [`CARGO: ${pago.cargoEmpleado.toUpperCase()}`],
    [
      'FECHA DE INGRESO:',
      '',
      pago.fechaIngreso.toLocaleDateString(),
      '',
      'SUELDO BASE MENSUAL:',
      '',
      pago.sueldoBase,
    ],
    ['CONCEPTO', '', '', '', 'CANTIDAD', '', 'MONTO'],
    [`NOMINA ${pago.nombrePeriodo.toUpperCase()}`],
    ...pago.asignaciones.map((asig) => [
      asig.nombre,
      '',
      '',
      '',
      '',
      '',
      asig.monto,
    ]),
    ['TOTAL ASIGNACIONES', '', '', '', '', '', pago.totalAsignaciones],
    ...pago.adicionales.map((adic) => [
      adic.nombre,
      '',
      '',
      '',
      '',
      '',
      adic.monto,
    ]),
    ['TOTAL BONOS', '', '', '', '', '', pago.totalAdicionales],
    ['DEDUCCIONES'],
    ...pago.deducciones.map((dedu) => [
      dedu.nombre,
      '',
      '',
      '',
      '',
      '',
      dedu.monto,
    ]),
    ['', '', '', '', 'TOTAL DEDUCCIONES', '', pago.totalDeducciones],
    [],
    ['', '', '', '', 'TOTAL NOMINA', '', pago.totalNomina],
    ['RECIBE CONFORME'],
    [`RESPONSABLE DE PAGO: ${pago.nombreCreador.toUpperCase()}`],
  ];
  const worksheet = SheetUtils.aoa_to_sheet(excelContent);
  const itemRows =
    pago.asignaciones.length +
    pago.adicionales.length +
    pago.deducciones.length +
    4;
  worksheet['!merges'] = [
    // Fila 1
    { s: { c: EXCEL_COLS.A, r: 0 }, e: { c: EXCEL_COLS.C, r: 0 } },
    { s: { c: EXCEL_COLS.D, r: 0 }, e: { c: EXCEL_COLS.E, r: 0 } },
    { s: { c: EXCEL_COLS.F, r: 0 }, e: { c: EXCEL_COLS.H, r: 0 } },
    // Fila 2
    { s: { c: EXCEL_COLS.A, r: 1 }, e: { c: EXCEL_COLS.E, r: 1 } },
    { s: { c: EXCEL_COLS.F, r: 1 }, e: { c: EXCEL_COLS.H, r: 1 } },
    // Fila 3
    { s: { c: EXCEL_COLS.A, r: 2 }, e: { c: EXCEL_COLS.B, r: 2 } },
    { s: { c: EXCEL_COLS.C, r: 2 }, e: { c: EXCEL_COLS.D, r: 2 } },
    { s: { c: EXCEL_COLS.E, r: 2 }, e: { c: EXCEL_COLS.F, r: 2 } },
    { s: { c: EXCEL_COLS.G, r: 2 }, e: { c: EXCEL_COLS.H, r: 2 } },
    // Fila 4
    { s: { c: EXCEL_COLS.A, r: 3 }, e: { c: EXCEL_COLS.H, r: 3 } },
    // Fila 5
    { s: { c: EXCEL_COLS.A, r: 4 }, e: { c: EXCEL_COLS.B, r: 4 } },
    { s: { c: EXCEL_COLS.C, r: 4 }, e: { c: EXCEL_COLS.D, r: 4 } },
    { s: { c: EXCEL_COLS.E, r: 4 }, e: { c: EXCEL_COLS.F, r: 4 } },
    { s: { c: EXCEL_COLS.G, r: 4 }, e: { c: EXCEL_COLS.H, r: 4 } },
    // Fila 6
    { s: { c: EXCEL_COLS.A, r: 5 }, e: { c: EXCEL_COLS.D, r: 5 } },
    { s: { c: EXCEL_COLS.E, r: 5 }, e: { c: EXCEL_COLS.F, r: 5 } },
    { s: { c: EXCEL_COLS.G, r: 5 }, e: { c: EXCEL_COLS.H, r: 5 } },
    // Fila 7
    { s: { c: EXCEL_COLS.A, r: 6 }, e: { c: EXCEL_COLS.D, r: 6 } },
    { s: { c: EXCEL_COLS.E, r: 6 }, e: { c: EXCEL_COLS.F, r: 6 } },
    { s: { c: EXCEL_COLS.G, r: 6 }, e: { c: EXCEL_COLS.H, r: 6 } },
    // Primas
    ...Array.from({ length: itemRows }, (_, i) => ({
      s: { c: EXCEL_COLS.A, r: 7 + i },
      e: { c: EXCEL_COLS.D, r: 7 + i },
    })),
    ...Array.from({ length: itemRows }, (_, i) => ({
      s: { c: EXCEL_COLS.E, r: 7 + i },
      e: { c: EXCEL_COLS.F, r: 7 + i },
    })),
    ...Array.from({ length: itemRows }, (_, i) => ({
      s: { c: EXCEL_COLS.G, r: 7 + i },
      e: { c: EXCEL_COLS.H, r: 7 + i },
    })),
    {
      s: { c: EXCEL_COLS.A, r: itemRows + 7 },
      e: { c: EXCEL_COLS.D, r: itemRows + 7 },
    },
    {
      s: { c: EXCEL_COLS.E, r: itemRows + 7 },
      e: { c: EXCEL_COLS.H, r: itemRows + 7 },
    },
    {
      s: { c: EXCEL_COLS.A, r: itemRows + 8 },
      e: { c: EXCEL_COLS.D, r: itemRows + 8 },
    },
    {
      s: { c: EXCEL_COLS.E, r: itemRows + 8 },
      e: { c: EXCEL_COLS.F, r: itemRows + 8 },
    },
    {
      s: { c: EXCEL_COLS.G, r: itemRows + 8 },
      e: { c: EXCEL_COLS.H, r: itemRows + 8 },
    },
    {
      s: { c: EXCEL_COLS.A, r: itemRows + 9 },
      e: { c: EXCEL_COLS.D, r: itemRows + 9 },
    },
    {
      s: { c: EXCEL_COLS.E, r: itemRows + 9 },
      e: { c: EXCEL_COLS.H, r: itemRows + 9 },
    },
    {
      s: { c: EXCEL_COLS.A, r: itemRows + 10 },
      e: { c: EXCEL_COLS.D, r: itemRows + 10 },
    },
    {
      s: { c: EXCEL_COLS.E, r: itemRows + 10 },
      e: { c: EXCEL_COLS.H, r: itemRows + 10 },
    },
    {
      s: { c: EXCEL_COLS.A, r: itemRows + 11 },
      e: { c: EXCEL_COLS.D, r: itemRows + 11 },
    },
    {
      s: { c: EXCEL_COLS.E, r: itemRows + 11 },
      e: { c: EXCEL_COLS.H, r: itemRows + 11 },
    },
  ];
  const workbook = SheetUtils.book_new();
  SheetUtils.book_append_sheet(workbook, worksheet, 'Recibo');
  writeFile(workbook, `Recibo-${pago.nombreEmpleado}.xlsx`);
}

/**
 * Genera el recibo en excel para un pago de programa alimentario
 * @param pago
 */
export function generarReciboAlimentario(pago: PagoAlimentarioExportar) {
  const excelContent = [
    [`PROGRAMA ALIMENTARIO ${pago.periodoAlimentario.toUpperCase()}`],
    [FOUNDATION_NAME, '', `RIF: ${RIF}`],
    [
      `DIRECCION: ${ADDRESS}`,
      '',
      '',
      '',
      '',
      `FECHA: ${pago.fecha.toLocaleDateString()}`,
    ],
    [
      'APELLIDO Y NOMBRE:',
      '',
      pago.nombreEmpleado.toUpperCase(),
      '',
      pago.cedulaEmpleado,
    ],
    [`CARGO: ${pago.cargoEmpleado.toUpperCase()}`],
    ['NUMERO DE HORAS LABORALES SEMANAL', '', '', '', pago.horasSemanales],
    [
      'NUMERO DE HORAS DIARIAS',
      '',
      '',
      '',
      (pago.horasSemanales / 5).toFixed(2),
    ],
    ['TOTAL BENEFICIO ALIMENTARIO', '', '', '', pago.totalBeneficio],
    ['DESCUENTO DE INASISTENCIA', '', '', '', pago.descuentoInasistencia],
    [
      'TOTAL A RECIBIR DE BENEFICIO ALIMENTARIO',
      '',
      '',
      '',
      pago.totalARecibir,
    ],
    ['RECIBE CONFORME', '', '', '', ''],
    [
      `RESPONSABLE DE PAGO: ${pago.nombreCreador.toUpperCase()}`,
      '',
      '',
      '',
      '',
    ],
  ];

  const worksheet = SheetUtils.aoa_to_sheet(excelContent);
  worksheet['!merges'] = [
    // Fila 1
    { s: { c: EXCEL_COLS.A, r: 0 }, e: { c: EXCEL_COLS.H, r: 0 } },
    // Fila 2
    { s: { c: EXCEL_COLS.A, r: 1 }, e: { c: EXCEL_COLS.B, r: 1 } },
    { s: { c: EXCEL_COLS.C, r: 1 }, e: { c: EXCEL_COLS.H, r: 1 } },
    // Fila 3
    { s: { c: EXCEL_COLS.A, r: 2 }, e: { c: EXCEL_COLS.E, r: 2 } },
    { s: { c: EXCEL_COLS.F, r: 2 }, e: { c: EXCEL_COLS.H, r: 2 } },
    // Fila 4
    { s: { c: EXCEL_COLS.A, r: 3 }, e: { c: EXCEL_COLS.B, r: 3 } },
    { s: { c: EXCEL_COLS.C, r: 3 }, e: { c: EXCEL_COLS.D, r: 3 } },
    { s: { c: EXCEL_COLS.E, r: 3 }, e: { c: EXCEL_COLS.H, r: 3 } },
    // Fila 5
    { s: { c: EXCEL_COLS.A, r: 4 }, e: { c: EXCEL_COLS.H, r: 4 } },
    // Resto de filas
    { s: { c: EXCEL_COLS.A, r: 5 }, e: { c: EXCEL_COLS.D, r: 5 } },
    { s: { c: EXCEL_COLS.E, r: 5 }, e: { c: EXCEL_COLS.H, r: 5 } },
    { s: { c: EXCEL_COLS.A, r: 6 }, e: { c: EXCEL_COLS.D, r: 6 } },
    { s: { c: EXCEL_COLS.E, r: 6 }, e: { c: EXCEL_COLS.H, r: 6 } },
    { s: { c: EXCEL_COLS.A, r: 7 }, e: { c: EXCEL_COLS.D, r: 7 } },
    { s: { c: EXCEL_COLS.E, r: 7 }, e: { c: EXCEL_COLS.H, r: 7 } },
    { s: { c: EXCEL_COLS.A, r: 8 }, e: { c: EXCEL_COLS.D, r: 8 } },
    { s: { c: EXCEL_COLS.E, r: 8 }, e: { c: EXCEL_COLS.H, r: 8 } },
    { s: { c: EXCEL_COLS.A, r: 9 }, e: { c: EXCEL_COLS.D, r: 9 } },
    { s: { c: EXCEL_COLS.E, r: 9 }, e: { c: EXCEL_COLS.H, r: 9 } },
    { s: { c: EXCEL_COLS.A, r: 10 }, e: { c: EXCEL_COLS.D, r: 10 } },
    { s: { c: EXCEL_COLS.E, r: 10 }, e: { c: EXCEL_COLS.H, r: 10 } },
    { s: { c: EXCEL_COLS.A, r: 11 }, e: { c: EXCEL_COLS.D, r: 11 } },
    { s: { c: EXCEL_COLS.E, r: 11 }, e: { c: EXCEL_COLS.H, r: 11 } },
  ];
  const workbook = SheetUtils.book_new();
  SheetUtils.book_append_sheet(workbook, worksheet, 'Recibo');
  writeFile(workbook, `Recibo-ProgramaAlimentario-${pago.nombreEmpleado}.xlsx`);
}

/**
 * Genera el recibo en excel para un pago de evaluación de desempeño
 * @param pago
 */
export function generarReciboDesempeño(pago: EvaluacionDesempeñoExportar) {
  const excelContent = [
    [`EVALUACIÓN DE DESEMPEÑO ${pago.periodo.toUpperCase()}`],
    [FOUNDATION_NAME, '', `RIF: ${RIF}`],
    [
      `DIRECCION: ${ADDRESS}`,
      '',
      '',
      '',
      '',
      `FECHA: ${pago.fecha.toLocaleDateString()}`,
    ],
    [
      'APELLIDO Y NOMBRE:',
      '',
      pago.nombreEmpleado.toUpperCase(),
      '',
      pago.cedulaEmpleado,
    ],
    [`CARGO: ${pago.cargoEmpleado.toUpperCase()}`],
    ['SUELDO BASE MENSUAL', '', '', '', pago.sueldoMensual],
    ['OTRAS PRIMAS SEGÚN ANEXOS ADMINISTRATIVOS', '', '', '', pago.otrasPrimas],
    ['TOTAL ASIGNACIONES', '', '', '', pago.sueldoMensual + pago.otrasPrimas],
    [
      'TOTAL ASIGNACIONES DIARIAS (Col. 5/30)',
      '',
      '',
      '',
      pago.totalAsignacionesDiarias,
    ],
    ['FACTOR DE CÁLCULO', '', '', '', pago.factorCalculo],
    [
      'DIAS SEGÚN RANGO OBTENIDO (MUY BUENO o BUENO)',
      '',
      '',
      '',
      pago.diasRangoObtenido,
    ],
    [
      'MONTO A PAGAR PRIMA DE EVALUACIÓN DE DESEMPEÑO',
      '',
      '',
      '',
      pago.montoFinal,
    ],
    ['RECIBE CONFORME', '', '', '', ''],
    [
      `RESPONSABLE DE PAGO: ${pago.nombreCreador.toUpperCase()}`,
      '',
      '',
      '',
      '',
    ],
  ];

  const worksheet = SheetUtils.aoa_to_sheet(excelContent);
  worksheet['!merges'] = [
    // Fila 1
    { s: { c: EXCEL_COLS.A, r: 0 }, e: { c: EXCEL_COLS.H, r: 0 } },
    // Fila 2
    { s: { c: EXCEL_COLS.A, r: 1 }, e: { c: EXCEL_COLS.B, r: 1 } },
    { s: { c: EXCEL_COLS.C, r: 1 }, e: { c: EXCEL_COLS.H, r: 1 } },
    // Fila 3
    { s: { c: EXCEL_COLS.A, r: 2 }, e: { c: EXCEL_COLS.E, r: 2 } },
    { s: { c: EXCEL_COLS.F, r: 2 }, e: { c: EXCEL_COLS.H, r: 2 } },
    // Fila 4
    { s: { c: EXCEL_COLS.A, r: 3 }, e: { c: EXCEL_COLS.B, r: 3 } },
    { s: { c: EXCEL_COLS.C, r: 3 }, e: { c: EXCEL_COLS.D, r: 3 } },
    { s: { c: EXCEL_COLS.E, r: 3 }, e: { c: EXCEL_COLS.H, r: 3 } },
    // Fila 5
    { s: { c: EXCEL_COLS.A, r: 4 }, e: { c: EXCEL_COLS.H, r: 4 } },
    // Resto de filas
    { s: { c: EXCEL_COLS.A, r: 5 }, e: { c: EXCEL_COLS.D, r: 5 } },
    { s: { c: EXCEL_COLS.E, r: 5 }, e: { c: EXCEL_COLS.H, r: 5 } },
    { s: { c: EXCEL_COLS.A, r: 6 }, e: { c: EXCEL_COLS.D, r: 6 } },
    { s: { c: EXCEL_COLS.E, r: 6 }, e: { c: EXCEL_COLS.H, r: 6 } },
    { s: { c: EXCEL_COLS.A, r: 7 }, e: { c: EXCEL_COLS.D, r: 7 } },
    { s: { c: EXCEL_COLS.E, r: 7 }, e: { c: EXCEL_COLS.H, r: 7 } },
    { s: { c: EXCEL_COLS.A, r: 8 }, e: { c: EXCEL_COLS.D, r: 8 } },
    { s: { c: EXCEL_COLS.E, r: 8 }, e: { c: EXCEL_COLS.H, r: 8 } },
    { s: { c: EXCEL_COLS.A, r: 9 }, e: { c: EXCEL_COLS.D, r: 9 } },
    { s: { c: EXCEL_COLS.E, r: 9 }, e: { c: EXCEL_COLS.H, r: 9 } },
    { s: { c: EXCEL_COLS.A, r: 10 }, e: { c: EXCEL_COLS.D, r: 10 } },
    { s: { c: EXCEL_COLS.E, r: 10 }, e: { c: EXCEL_COLS.H, r: 10 } },
    { s: { c: EXCEL_COLS.A, r: 11 }, e: { c: EXCEL_COLS.D, r: 11 } },
    { s: { c: EXCEL_COLS.E, r: 11 }, e: { c: EXCEL_COLS.H, r: 11 } },
    { s: { c: EXCEL_COLS.A, r: 12 }, e: { c: EXCEL_COLS.D, r: 12 } },
    { s: { c: EXCEL_COLS.E, r: 12 }, e: { c: EXCEL_COLS.H, r: 12 } },
    { s: { c: EXCEL_COLS.A, r: 13 }, e: { c: EXCEL_COLS.D, r: 13 } },
    { s: { c: EXCEL_COLS.E, r: 13 }, e: { c: EXCEL_COLS.H, r: 13 } },
  ];
  const workbook = SheetUtils.book_new();
  SheetUtils.book_append_sheet(workbook, worksheet, 'Recibo');
  writeFile(workbook, `Recibo-EvaluacionDesempeño-${pago.nombreEmpleado}.xlsx`);
}
