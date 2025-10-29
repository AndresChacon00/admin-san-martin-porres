// Esta pagina deberia ser borrada
import { useLoaderData, MetaFunction } from '@remix-run/react';

import { ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { GenerarRelacionParticipantesDialog } from '~/components/Planillas/GenerarRelacionParticipantesDialog';

export const meta: MetaFunction = () => {
  return [{ title: 'Cursos detalle | San Martín de Porres' }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const codigoCurso = params.codigo;

  return codigoCurso;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // Obtener los valores del formulario
  const nombreCentro = formData.get('nombreCentro');
  const coordinadorGeneral = formData.get('coordinadorGeneral');

  // Imprimir los datos en la consola del servidor
  console.log('Nombre del Centro:', nombreCentro);
  console.log('Coordinador General:', coordinadorGeneral);

  // Puedes realizar otras acciones aquí, como guardar en la base de datos

  return json({ success: true });
};

export default function CursosDetallePage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Cursos detalleee</h1>
      {/* Use client-side dialog component to generate PDF in the browser */}
      <GenerarRelacionParticipantesDialog
        idPeriodo={'0'} // placeholder: set correct periodo when available
        codigoCurso={String(data)}
        estudiantesInscritos={[]}
        curso={{ nombreCurso: String(data) }}
      />
    </>
  );
}
