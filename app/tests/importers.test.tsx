import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { importEmpleados } from '../lib/importers';

describe('importEmpleados', () => {
  it('should correctly import employees from an Excel file', () => {
    const filePath = resolve(__dirname, '../data/test-data.xls');
    const fileBuffer = readFileSync(filePath);
    const empleados = importEmpleados(fileBuffer);

    expect(empleados).toBeInstanceOf(Array);
    expect(empleados.length).toBeGreaterThan(0);

    empleados.forEach((empleado) => {
      console.log(JSON.stringify(empleado, null, 2));
      expect(empleado).toHaveProperty('nombreCompleto');
      expect(empleado).toHaveProperty('cedula');
      expect(empleado).toHaveProperty('fechaNacimiento');
      expect(empleado).toHaveProperty('sexo');
      expect(empleado).toHaveProperty('estadoCivil');
      expect(empleado).toHaveProperty('religion');
      expect(empleado).toHaveProperty('hijosMenoresSeis');
      expect(empleado).toHaveProperty('montoMensualGuarderia');
      expect(empleado).toHaveProperty('fechaIngresoAvec');
      expect(empleado.fechaIngresoAvec).not.toBeNull();
      expect(empleado).toHaveProperty('fechaIngresoPlantel');
      expect(empleado.fechaIngresoPlantel).not.toBeNull();
      expect(empleado).toHaveProperty('titulo');
      expect(empleado).toHaveProperty('descripcionTitulo');
      expect(empleado).toHaveProperty('mencionTitulo');
      expect(empleado).toHaveProperty('carreraEstudiando');
      expect(empleado).toHaveProperty('tipoLapsoEstudios');
      expect(empleado).toHaveProperty('numeroLapsosAprobados');
      expect(empleado).toHaveProperty('postgrado');
      expect(empleado).toHaveProperty('experienciaLaboral');
      expect(empleado).toHaveProperty('gradoSistema');
      expect(empleado).toHaveProperty('nivelSistema');
      expect(empleado).toHaveProperty('gradoCentro');
      expect(empleado).toHaveProperty('nivelCentro');
      expect(empleado).toHaveProperty('cargo');
      expect(empleado).toHaveProperty('horasSemanales');
      expect(empleado).toHaveProperty('sueldo');
      expect(empleado).toHaveProperty('asignacionesMensual');
      expect(empleado).toHaveProperty('deduccionesMensual');
      expect(empleado).toHaveProperty('primaAntiguedad');
      expect(empleado).toHaveProperty('primaGeografica');
      expect(empleado).toHaveProperty('primaCompensacionAcademica');
      expect(empleado).toHaveProperty('cantidadHijos');
      expect(empleado).toHaveProperty('primaAsistencial');
      expect(empleado).toHaveProperty('contribucionDiscapacidad');
      expect(empleado).toHaveProperty('contribucionDiscapacidadHijos');
      expect(empleado).toHaveProperty('porcentajeSso');
      expect(empleado).toHaveProperty('porcentajeRpe');
      expect(empleado).toHaveProperty('porcentajeFaov');
      expect(empleado).toHaveProperty('pagoDirecto');
      expect(empleado).toHaveProperty('jubilado');
      expect(empleado).toHaveProperty('cuentaBancaria');
      expect(empleado).toHaveProperty('observaciones');
      expect(empleado).toHaveProperty('fechaRegistro');
      expect(empleado).toHaveProperty('fechaActualizacion');
    });
  });
});
