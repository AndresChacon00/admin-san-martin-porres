import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const imprimirRecibo = (cedulaEstudiante: string, fechaPago: string) => {
  const receipt = document.getElementById('recibo');
  if (receipt) {
    html2canvas(receipt).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Puedes ajustar el formato y la orientación

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Calcula la posición para centrar la imagen (opcional)
      const x = (pdfWidth - pdfWidth) / 2;
      const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
      const fechaPagoFormateada = fechaPago.replace(/-/g, '.');

      const nombreArchivo = `recibo-${cedulaEstudiante}-${fechaPagoFormateada}.pdf`;

      pdf.save(nombreArchivo);
    });
  } else {
    console.error('No se encontró el elemento con el ID "receipt-to-print"');
  }
};
