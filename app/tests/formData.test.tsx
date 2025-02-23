import { extractEmpleadoFormData } from '../lib/formData';
import { describe, it, expect } from 'vitest';

describe('extractEmpleadoFormData', () => {
  it('should extract employee data correctly from FormData', () => {
    const formData = new FormData();
    formData.append('cedula', '12345678');
    formData.append('nombreCompleto', 'John Doe');
    formData.append('fechaNacimiento', '1990-01-01');
    formData.append('sexo', 'M');
    formData.append('estadoCivil', 'Soltero');
    formData.append('religion', 'Católica');
    formData.append('cantidadHijos', '2');
    formData.append('hijosMenoresSeis', '1');
    formData.append('fechaIngresoAvec', '2020-01-01');
    formData.append('fechaIngresoPlantel', '2021-01-01');
    formData.append('titulo', 'Ingeniero');
    formData.append('descripcionTitulo', '');
    formData.append('mencionTitulo', '');
    formData.append('carreraEstudiando', '');
    formData.append('tipoLapsoEstudios', '');
    formData.append('numeroLapsosAprobados', '');
    formData.append('postgrado', 'Maestría');
    formData.append('experienciaLaboral', '5');
    formData.append('gradoSistema', 'Grado 1');
    formData.append('nivelSistema', 'Nivel 1');
    formData.append('gradoCentro', 'Grado 2');
    formData.append('nivelCentro', 'Nivel 2');
    formData.append('cargo', 'Profesor');
    formData.append('horasSemanales', '40');
    formData.append('sueldo', '1000');
    formData.append('asignacionesMensual', '200');
    formData.append('deduccionesMensual', '50');
    formData.append('primaAntiguedad', '100');
    formData.append('primaGeografica', '50');
    formData.append('primaCompensacionAcademica', '150');
    formData.append('primaAsistencial', '100');
    formData.append('contribucionDiscapacidad', '20');
    formData.append('contribucionDiscapacidadHijos', '10');
    formData.append('porcentajeSso', '5');
    formData.append('porcentajeRpe', '3');
    formData.append('porcentajeFaov', '2');
    formData.append('pagoDirecto', 'true');
    formData.append('jubilado', 'false');
    formData.append('cuentaBancaria', '1234567890');
    formData.append('observaciones', 'Ninguna');

    const result = extractEmpleadoFormData(formData);

    expect(result).toEqual({
      cedula: '12345678',
      nombreCompleto: 'John Doe',
      fechaNacimiento: new Date('1990-01-01'),
      sexo: 'M',
      estadoCivil: 'Soltero',
      religion: 'Católica',
      cantidadHijos: 2,
      hijosMenoresSeis: 1,
      fechaIngresoAvec: new Date('2020-01-01'),
      fechaIngresoPlantel: new Date('2021-01-01'),
      titulo: 'Ingeniero',
      descripcionTitulo: '',
      mencionTitulo: '',
      carreraEstudiando: '',
      tipoLapsoEstudios: '',
      numeroLapsosAprobados: 0,
      postgrado: 'Maestría',
      experienciaLaboral: 5,
      gradoSistema: 'Grado 1',
      nivelSistema: 'Nivel 1',
      gradoCentro: 'Grado 2',
      nivelCentro: 'Nivel 2',
      cargo: 'Profesor',
      horasSemanales: 40,
      sueldo: 1000,
      asignacionesMensual: 200,
      deduccionesMensual: 50,
      primaAntiguedad: 100,
      primaGeografica: 50,
      primaCompensacionAcademica: 150,
      primaAsistencial: 100,
      contribucionDiscapacidad: 20,
      contribucionDiscapacidadHijos: 10,
      porcentajeSso: 5,
      porcentajeRpe: 3,
      porcentajeFaov: 2,
      pagoDirecto: true,
      jubilado: false,
      cuentaBancaria: '1234567890',
      observaciones: 'Ninguna',
    });
  });
});
