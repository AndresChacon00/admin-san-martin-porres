import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Estudiante {
  cedula: string;
  nombre: string;
  apellido: string;
  genero: string;
  deuda: number;
}

interface PlanillaData {
  idPeriodo: string;
  codigoCurso: string;
  estudiantesInscritos: Estudiante[];
  coordinadorGeneral: string;
  curso: any;
}

export async function generarPlanillaPDF({
  idPeriodo,
  codigoCurso,
  estudiantesInscritos,
  coordinadorGeneral,
  curso,
}: PlanillaData) {
  // Calcular estadísticas de participantes
  const totalParticipantes = estudiantesInscritos.length;
  const mujeresParticipantes = estudiantesInscritos.filter(
    (estudiante) => estudiante.genero.toLowerCase() === 'f',
  ).length;
  const hombresParticipantes = estudiantesInscritos.filter(
    (estudiante) => estudiante.genero.toLowerCase() === 'm',
  ).length;
  console.log('CURSOO', curso);
  // Crear el contenido dinámico para la planilla
  const planillaContent = document.createElement('div');
  planillaContent.id = 'planilla-content';
  planillaContent.style.padding = '20px';
  planillaContent.style.fontFamily = 'Arial, sans-serif';
  planillaContent.style.fontSize = '0.9em';
  planillaContent.style.width = '794px'; // Ancho estándar para una hoja A4
  planillaContent.innerHTML = `
    <div style="display: flex; align-items: flex-end; margin-bottom: 10px;">
      <img src="/logo_avec.png" alt="Logo AVEC" style="height: 100px; margin-right: 20px;" />
      <h3 style="font-size: 18px; font-weight: bold; text-align: center ; flex: 1;">
        Relación Final de los Participantes
      </h3>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div style="flex: 1; text-align: left;">
            <p><strong>Nombre del Centro:</strong></p>
            <p><strong>Código:</strong></p>
            <p><strong>Coordinador General:</strong></p>
            <p><strong>Periodo: ${idPeriodo}</strong></p>
        </div>
        <div style="flex: 1; text-align: left;">
            <p>FUNDACECASMAR</p>
            <p>11C058</p>
            <p>${coordinadorGeneral}</p>
            <p><strong>Curso:</strong> ${curso.nombreCurso}</p>
        </div>
    </div>
    <p style="text-align: left; text-decoration: underline;">Registrado en la Escuela de Formación AVEC, Programa CECAL</p>
    <p style="text-align: center;">Libro N°:_______________________________________________________ Fecha:_________</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid black;">
        <thead>
            <tr>
                <th style="border: 1px solid black; text-align: center; vertical-align: middle; padding: 5px;">N°</th>
                <th style="border: 1px solid black; text-align: left; vertical-align: middle; padding: 5px;">Apellidos y Nombres</th>
                <th style="border: 1px solid black; text-align: center; vertical-align: middle; padding: 5px;">Cédula de Identidad</th>
                <th style="border: 1px solid black; text-align: center; vertical-align: middle; padding: 5px;">Sexo</th>
                <th style="border: 1px solid black; text-align: center; vertical-align: middle; padding: 5px;">Firma</th>
            </tr>
        </thead>
        <tbody>
            ${estudiantesInscritos
              .map(
                (estudiante, index) => `
                <tr>
                    <td style="border: 1px solid black; text-align: center; vertical-align: middle; padding-bottom: 5px;">${index + 1}</td>
                    <td style="border: 1px solid black; text-align: left; vertical-align: middle;padding-left: 5px; padding-bottom: 5px;">${estudiante.apellido} ${estudiante.nombre}</td>
                    <td style="border: 1px solid black; text-align: center; vertical-align: middle; padding-bottom: 5px;">${estudiante.cedula}</td>
                    <td style="border: 1px solid black; text-align: center; vertical-align: middle; padding-bottom: 5px;">${estudiante.genero}</td>
                    <td style="border: 1px solid black; text-align: center; vertical-align: middle; padding-bottom: 5px;"></td>
                </tr>
            `,
              )
              .join('')}
        </tbody>
    </table>
    <p style="font-style: italic; margin-top: 20px;">
        <strong>Relación final de participantes</strong><br>
        Número de mujeres participantes: ${mujeresParticipantes}<br>
        Número de hombres participantes: ${hombresParticipantes}<br>
        Número total de participantes: ${totalParticipantes}
    </p>
    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="text-align: center; flex: 1;">
            <p>______________________________</p>
            <p>Firma del Coordinador</p>
        </div>
        <div style="text-align: center; flex: 1;">
            <p>______________________________</p>
            <p>Sello del Centro</p>
        </div>
    </div>
`;

  // Agregar el contenido al DOM temporalmente
  document.body.appendChild(planillaContent);

  // Generar el PDF usando html2canvas y jsPDF
  const canvas = await html2canvas(planillaContent);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Ajusta las dimensiones según sea necesario
  pdf.save(`Planilla_Curso_${codigoCurso}_Periodo_${idPeriodo}.pdf`);

  // Eliminar el contenido temporal del DOM
  document.body.removeChild(planillaContent);
}
