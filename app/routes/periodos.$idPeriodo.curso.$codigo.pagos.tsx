import { useLoaderData, useParams } from '@remix-run/react';
import {  getRecibosPorCursoPeriodo, editarPago, eliminarPago    } from '~/api/controllers/pagosEstudiantesCursos';
import { DataTablePagosEstudiantes } from '~/components/data-tables/pagosEstudiantes-data-table';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { pagosColumns } from '~/components/columns/pagos-estudiante';
import ReciboEstudiante from '~/components/ReciboEstudiantes';
import { imprimirRecibo } from '~/components/ImprimirRecibo';
import { useState } from 'react';
import * as React from 'react';

export const loader: LoaderFunction = async ({ params }) => {
  const idPeriodo = Number(params.idPeriodo);
  const codigoCurso = params.codigo;

  if (isNaN(idPeriodo) || !codigoCurso) {
    throw new Response('Datos inválidos', { status: 400 });
  }

  const pagos = await  getRecibosPorCursoPeriodo ({idPeriodo, codigoCurso});

  return pagos;
};

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const idPeriodo = Number(params.idPeriodo);
    const codigoCurso = params.codigo;
  
    if (!codigoCurso || isNaN(idPeriodo)) {
      return { error: 'Datos inválidos' };
    }
  
    if (actionType === 'editar') {
      const idPago = Number(formData.get('idPago'));
      const monto = Number(formData.get('monto'));
      const fecha = formData.get('fecha') as string;
      const tipoPago = formData.get('tipoPago') as string;
      const comprobante = formData.get('comprobante') as string;
  
      if (isNaN(idPago) || isNaN(monto) || !fecha || !tipoPago) {
        return { error: 'Datos inválidos' };
      }
  
      const result = await editarPago(idPago, {
        monto,
        fecha: new Date(fecha),
        tipoPago,
        comprobante,
      });
  
      if (result.type === 'error') {
        return { error: result.message };
      }
    }
  
    if (actionType === 'eliminar') {
      const idPago = Number(formData.get('idPago'));
  
      if (isNaN(idPago)) {
        return { error: 'ID de pago inválido' };
      }
  
      const result = await eliminarPago(idPago);
  
      if (result.type === 'error') {
        return { error: result.message };
      }
    }
  
    return null;
  };

export default function PagosCursoPage() {
  const pagos = useLoaderData<typeof loader>();
  const { idPeriodo, codigo } = useParams();
  const [selectedPagoId, setSelectedPagoId] = useState<number | null>(null);

  const handleGenerateReceipt = (idPago: number) => {
    console.log('Generating receipt for ID:', idPago);
    setSelectedPagoId(idPago); // Update the selectedPagoId state
  };

  const selectedPago = selectedPagoId
    ? pagos.find((pago) => pago.idPago === selectedPagoId)
    : null;

  // Trigger imprimirRecibo when selectedPagoId changes
  React.useEffect(() => {
    if (selectedPago) {
        console.log('Calling imprimirRecibo with:', selectedPago.cedula, selectedPago.fechaPago);
      imprimirRecibo(selectedPago.cedula, selectedPago.fecha);
      // // Reset the state after printing
      setSelectedPagoId(null);
    }
  }, [selectedPago]);

  console.log('Pagos:', pagos);

  return (
    <>
      <h1 className="text-xl font-bold">Historial de Pagos del Curso {codigo} - Periodo {idPeriodo}</h1>
      <div className="py-4 w-3/4">
      <main className="py-4">
        <DataTablePagosEstudiantes columns={pagosColumns} data={pagos} onGenerateReceipt={handleGenerateReceipt} />
      </main>
      </div>

       {/* Hidden ReciboEstudiante for printing */}
       {selectedPagoId && (
        <div
          id="recibo"
          style={{
            display: 'hidden',
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
          }}
        >
          <ReciboEstudiante
            numeroRecibo={selectedPago.numeroRecibo.toString()}
            codigoCurso={selectedPago.codigoCurso}
            nombre={selectedPago.nombre}
            apellido={selectedPago.apellido}
            cedula={selectedPago.cedula}
            sexo={selectedPago.sexo}
            fechaNacimiento={
              selectedPago.fechaNacimiento instanceof Date
                ? selectedPago.fechaNacimiento.toISOString().split('T')[0]
                : selectedPago.fechaNacimiento
            }
            religion={selectedPago.religion}
            telefono={selectedPago.telefono}
            correo={selectedPago.correo}
            direccion={selectedPago.direccion}
            ultimoAñoCursado={selectedPago.ultimoAnioCursado}
            curso={selectedPago.curso}
            periodo={selectedPago.periodo.toString()}
            fechaPago={
              selectedPago.fecha instanceof Date
                ? selectedPago.fecha.toISOString().split('T')[0]
                : selectedPago.fecha
            }
            numeroTransferencia={selectedPago.numeroTransferencia}
            monto={selectedPago.monto.toString()}
            observaciones={selectedPago.observaciones}
          />
        </div>
      )}

    </>
  );
}