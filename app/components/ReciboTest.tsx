import React from 'react';
import Receipt from './RecibosEstudiantes';

const ReciboTest = () => {
  const dummyData = {
    numeroRecibo: '001234',
    codigoCurso: 'CURSO123',
    talla: 'M',
    nombre: 'Juan',
    apellido: 'Pérez',
    cedula: '12345678',
    sexo: 'Masculino',
    fechaNacimiento: '01/01/2000',
    edad: '25',
    religion: 'Católica',
    telefono: '0414-1234567',
    correo: 'juan.perez@example.com',
    direccionPuntoReferencia: 'Calle Principal, Casa #123, Brisas del Sur',
    ultimoAnioCursado: '2024',
    curso: 'Programación Básica',
    periodo: '2025-1',
    fechaPago: '03/05/2025',
    numeroTransferencia: 'TRX123456789',
    monto: '150.00',
    observaciones: 'Pago realizado sin inconvenientes.',
    logoSrc: '/logo-fit.png', // Ruta relativa al archivo en el directorio public
    nombreCentroCapacitacion: 'Centro de Capacitación FUNDACECASMAR',
  };

  return <Receipt {...dummyData} />;
};

export default ReciboTest;