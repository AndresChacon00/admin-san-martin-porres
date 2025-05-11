import React from 'react';

interface ReceiptProps {
  numeroRecibo: string;
  codigoCurso: string;
  talla?: string;
  nombre: string;
  apellido: string;
  cedula: string;
  sexo: string;
  fechaNacimiento: string;
  religion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ultimoAnioCursado: string;
  curso: string;
  periodo: string;
  fechaPago: string;
  numeroTransferencia: string;
  monto: string;
  observaciones: string;
  // Logo y nombre del centro podrían ser estáticos o pasarse como prop si cambian
  logoSrc?: string;
}

const ReciboEstudiante: React.FC<ReceiptProps> = ({
  numeroRecibo,
  codigoCurso,
  talla,
  nombre,
  apellido,
  cedula,
  sexo,
  fechaNacimiento,
  religion,
  telefono,
  correo,
  direccion,
  ultimoAnioCursado,
  curso,
  periodo,
  fechaPago,
  numeroTransferencia,
  monto,
  observaciones,
  logoSrc,
}) => {
  const currentDate = new Date().toLocaleDateString();

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculatedAge = calculateAge(fechaNacimiento);

  return (
    <div style={styles.receiptContainer} id="recibo">
      {logoSrc && <div style={styles.logoContainer}><img src={logoSrc} alt="Logo Curso" style={styles.logo} /></div>}
       <h3 style={styles.centerText}>FUNDACIÓN AMIGOS DEL CENTRO DE CAPACITACIÓN SAN MARTIN DE PORRES <br/> FUNDACECASMAR</h3>

      <div style={styles.row}>
        <div style={styles.column}>FUNDACECASMAR</div>
        <div style={styles.column}>N° Recibo: {numeroRecibo}</div>
      </div>

      <div style={styles.row}>
        <div style={styles.column}>COD: {codigoCurso}</div>
        <div style={styles.column}>Talla: {talla ? talla : ''}</div>
      </div>

      <div style={styles.row}>
        <div style={styles.column}>LUGAR: BRISAS DEL SUR:</div>
        <div style={styles.column}>FECHA: {currentDate}</div>
      </div>

      <div style={{ ...styles.fullWidth, ...styles.blueBackground }}>DATOS DEL PARTICIPANTE</div>

      <div style={styles.row}>
        <div style={styles.column}>NOMBRE: {nombre}</div>
        <div style={styles.column}>APELLIDO: {apellido}</div>
        <div style={styles.column}>CEDULA: {cedula}</div>
        <div style={styles.column}>SEXO: {sexo}</div>
        <div style={styles.column}>FECHA DE NACIMIENTO: {fechaNacimiento}</div>
      </div>

      <div style={styles.row}>
        <div style={styles.column}>EDAD: {calculatedAge}</div>
        <div style={styles.column}>RELIGION: {religion}</div>
        <div style={styles.column}>TELEFONO: {telefono}</div>
        <div style={styles.column}>CORREO: {correo}</div>
      </div>

      <div style={styles.fullWidth}>DIRECCION Y PUNTO DE REFERENCIA: {direccion}</div>

      <div style={styles.row}>
        <div style={styles.column}>ULTIMO AÑO CURSADO: {ultimoAnioCursado}</div>
        <div style={styles.column}>CURSO: {curso}</div>
      </div>

      <div style={styles.fullWidth}>PERIODO: {periodo}</div>

      <div style={{ ...styles.fullWidth, ...styles.blueBackground }}>DATOS DE LA TRANSFERENCIA</div>

      <div style={styles.row}>
        <div style={styles.column}>FECHA PAGO: {fechaPago}</div>
        <div style={styles.column}>NÚMERO DE TRANSFERENCIA: {numeroTransferencia}</div>
        <div style={styles.column}>MONTO: {monto}</div>
      </div>

      <div style={styles.fullWidth}>OBSERVACIONES: {observaciones}</div>

      <div style={styles.signatureRow}>
        <div style={styles.signatureSpace}>FIRMA DEL PARTICIPANTE</div>
        <div style={styles.signatureSpace}>SELLO</div>
        <div style={styles.signatureSpace}>FIRMA DEL COORDINADOR</div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  receiptContainer: {
    border: '1px solid #ccc',
    padding: '15px',
    width: '1000px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.9em',
    borderSpacing: '0',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '10px',
  },
  logo: {
    height: '100px',
  },
  centerText: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '1.1em',
    fontWeight: 'bold',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    borderBottom: '1px solid black',
    marginBottom: '-1px', // Eliminamos el espacio entre filas
  },
  column: {
    flex: '1 1 auto',
    padding: '5px',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    borderTop: '1px solid black',
  },
  fullWidth: {
    width: '100%',
    padding: '5px',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderTop: '1px solid black',
    marginBottom: '-1px', // Eliminamos el espacio
  },
  blueBackground: {
    backgroundColor: '#e0f2f7',
    padding: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderTop: '1px solid black',
    marginBottom: '-1px', // Eliminamos el espacio
  },
  signatureRow: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '60px',
  },
  signatureSpace: {
    textAlign: 'center',
    borderTop: '1px solid #000',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '30%',
  },
};

export default ReciboEstudiante;