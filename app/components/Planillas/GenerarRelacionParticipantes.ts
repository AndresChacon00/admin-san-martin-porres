import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Estudiante {
  cedula: string;
  nombre: string;
  apellido: string;
  genero: string;
  deuda: number;
}

interface PlanillaData {
  idPeriodo: number;
  codigoCurso: string;
  estudiantesInscritos: Estudiante[];
  nombreCentro: string;
  coordinadorGeneral: string;
}

export async function generarPlanillaPDF({
  idPeriodo,
  codigoCurso,
  estudiantesInscritos,
  nombreCentro,
  coordinadorGeneral,
}: PlanillaData) {
  // Calcular estadísticas de participantes
  const totalParticipantes = estudiantesInscritos.length;
  const mujeresParticipantes = estudiantesInscritos.filter(
    (estudiante) => estudiante.genero.toLowerCase() === 'f',
  ).length;
  const hombresParticipantes = estudiantesInscritos.filter(
    (estudiante) => estudiante.genero.toLowerCase() === 'm',
  ).length;

  // Crear el contenido dinámico para la planilla
  const planillaContent = document.createElement('div');
  planillaContent.id = 'planilla-content';
  planillaContent.style.padding = '20px';
  planillaContent.innerHTML = `
    <h3 style="font-size: 18px; font-weight: bold; text-align: center;">Relación Final de los Participantes</h3>
    <p><strong>Nombre del Centro:</strong> ${nombreCentro}</p>
    <p><strong>Código:</strong> ${codigoCurso}</p>
    <p><strong>Coordinador General:</strong> ${coordinadorGeneral}</p>
    <p><strong>Periodo:</strong> ${idPeriodo}</p>
    <p>Registrado en la Escuela de Formación AVEC, Programa CECAL</p>
    <p>Libro N°:_______________________________________________________ Fecha:_________</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="border: 1px solid black; text-align: center; padding: 5px;">N°</th>
          <th style="border: 1px solid black; text-align: left; padding: 5px;">Apellidos y Nombres</th>
          <th style="border: 1px solid black; text-align: center; padding: 5px;">Cédula de Identidad</th>
          <th style="border: 1px solid black; text-align: center; padding: 5px;">Sexo</th>
          <th style="border: 1px solid black; text-align: center; padding: 5px;">Firma</th>
        </tr>
      </thead>
      <tbody>
        ${estudiantesInscritos
          .map(
            (estudiante, index) => `
          <tr>
            <td style="border: 1px solid black; text-align: center; padding: 5px;">${index + 1}</td>
            <td style="border: 1px solid black; text-align: left; padding: 5px;">${estudiante.apellido} ${estudiante.nombre}</td>
            <td style="border: 1px solid black; text-align: center; padding: 5px;">${estudiante.cedula}</td>
            <td style="border: 1px solid black; text-align: center; padding: 5px;">${estudiante.genero}</td>
            <td style="border: 1px solid black; text-align: center; padding: 5px;"></td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
    <p style="font-style: italic; font-weight: bold; margin-top: 20px;">
      Relación final de participantes<br>
      Número de mujeres participantes: ${mujeresParticipantes}<br>
      Número de hombres participantes: ${hombresParticipantes}<br>
      Número total de participantes: ${totalParticipantes}
    </p>
    <div style="margin-top: 40px;">
      <p>______________________________</p>
      <p>Firma del Coordinador</p>
    </div>
    <div style="margin-top: 20px;">
      <p>______________________________</p>
      <p>Sello del Centro</p>
    </div>
  `;

  // Agregar el contenido al DOM temporalmente
  document.body.appendChild(planillaContent);

  // Generar el PDF usando html2canvas y jsPDF
  const canvas = await html2canvas(planillaContent);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();

  pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Ajusta las dimensiones según sea necesario
  pdf.save(`Planilla_Curso_${codigoCurso}_Periodo_${idPeriodo}.pdf`);

  // Eliminar el contenido temporal del DOM
  document.body.removeChild(planillaContent);
}
