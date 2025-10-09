import { useLoaderData, useParams } from '@remix-run/react';
import { getRecibosPorCursoPeriodo, editarPago, eliminarPago } from '~/api/controllers/pagosEstudiantesCursos';
import { getCursoById } from '~/api/controllers/cursos';
import { DataTablePagosEstudiantes } from '~/components/data-tables/pagosEstudiantes-data-table';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { pagosColumns } from '~/components/columns/pagos-estudiante';
import ReciboEstudiante from '~/components/ReciboEstudiantes';
import { imprimirRecibo } from '~/components/ImprimirRecibo';
import { useState } from 'react';
import * as React from 'react';

export const loader: LoaderFunction = async ({ params }) => {
  const idPeriodo = params.idPeriodo as string | undefined;
  const codigoCurso = params.codigo as string | undefined;

  if (!idPeriodo || !codigoCurso) {
    throw new Response('Datos inválidos', { status: 400 });
  }

  const pagos = await getRecibosPorCursoPeriodo({ idPeriodo, codigoCurso });
  const curso = await getCursoById(codigoCurso);

  return { pagos, curso };
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
  type PagoRecibo = {
    idPago: number;
    numeroRecibo: number;
    codigoCurso: string;
    nombre: string;
    apellido: string;
    cedula: string;
    sexo?: string;
    fechaNacimiento?: Date | string;
    religion?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
    ultimoAnioCursado?: string | number;
    tipoPago?: string;
    curso?: string;
    periodo: string | number;
    fecha: Date | string;
    numeroTransferencia?: string | null;
    comprobante?: string | null;
    monto: number;
    observaciones?: string;
  };

  type CursoSmall = { codigo: string; nombreCurso?: string };
  const loaderData = useLoaderData<{ pagos: PagoRecibo[]; curso?: CursoSmall }>();
  const pagos = loaderData.pagos ?? [];
  const curso = loaderData.curso;
  const { idPeriodo, codigo } = useParams();
  const [selectedPagoId, setSelectedPagoId] = useState<number | null>(null);

  const handleGenerateReceipt = (idPago: number) => {
    console.log('Generating receipt for ID:', idPago);
    setSelectedPagoId(idPago); // Update the selectedPagoId state
  };

  const selectedPago = selectedPagoId
    ? pagos.find((pago: PagoRecibo) => pago.idPago === selectedPagoId) ?? null
    : null;

  // Trigger imprimirRecibo when selectedPagoId changes
  React.useEffect(() => {
    if (selectedPago) {
      console.log('Calling imprimirRecibo with:', selectedPago.cedula, selectedPago.fecha);
      imprimirRecibo(selectedPago.cedula, selectedPago.fecha);
      // Reset the state after printing
      setSelectedPagoId(null);
    }
  }, [selectedPago]);

  console.log('Pagos:', pagos);

  return (
    <>
  <h1 className="text-xl font-bold">Historial de Pagos del Curso {curso?.nombreCurso ?? codigo} - Periodo {idPeriodo}</h1>
      <div className="py-4 w-3/4">
      <main className="py-4">
        {/* Map loader result to DataTable expected shape */}
        {(() => {
          const pagosForTable = pagos.map((p) => ({
            idPago: p.idPago,
            idPeriodo: String(p.periodo),
            codigoCurso: p.codigoCurso,
            // the data-table column expects 'cedulaEstudiante'
            cedulaEstudiante: p.cedula,
            monto: p.monto,
            fecha: p.fecha instanceof Date ? p.fecha : new Date(String(p.fecha)),
            tipoPago: p.tipoPago ?? '',
            comprobante: p.comprobante ?? null,
          }));

          return (
            <DataTablePagosEstudiantes columns={pagosColumns} data={pagosForTable} onGenerateReceipt={handleGenerateReceipt} />
          );
        })()}
      </main>
      </div>

       {/* Hidden ReciboEstudiante for printing */}
       {selectedPago && (
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
            numeroRecibo={String(selectedPago.numeroRecibo)}
            codigoCurso={selectedPago.codigoCurso ?? ''}
            nombre={selectedPago.nombre ?? ''}
            apellido={selectedPago.apellido ?? ''}
            cedula={selectedPago.cedula ?? ''}
            sexo={selectedPago.sexo ?? ''}
            fechaNacimiento={
              selectedPago.fechaNacimiento instanceof Date
                ? selectedPago.fechaNacimiento.toISOString().split('T')[0]
                : String(selectedPago.fechaNacimiento ?? '')
            }
            religion={selectedPago.religion ?? ''}
            telefono={selectedPago.telefono ?? ''}
            correo={selectedPago.correo ?? ''}
            direccion={selectedPago.direccion ?? ''}
            ultimoAñoCursado={String(selectedPago.ultimoAnioCursado ?? '')}
            curso={selectedPago.curso ?? ''}
            periodo={String(selectedPago.periodo)}
            fechaPago={
              selectedPago.fecha instanceof Date
                ? selectedPago.fecha.toISOString().split('T')[0]
                : String(selectedPago.fecha)
            }
            numeroTransferencia={String(selectedPago.numeroTransferencia ?? '')}
            monto={String(selectedPago.monto)}
            observaciones={String(selectedPago.observaciones ?? '')}
          />
        </div>
      )}

    </>
  );
}