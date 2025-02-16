import { useLoaderData, MetaFunction } from '@remix-run/react';
import { getEstudiantes } from '~/api/controllers/estudiantes.server';
import { estudiantesColumns } from '~/components/columns/estudiantes-columns';
import { DataTable } from '~/components/ui/data-table';

export const meta: MetaFunction = () => {
  return [{ title: 'Estudiantes | San Matín de Porres' }];
};

export async function loader() {
  const data = await getEstudiantes();
  return data;
}

export default function EstudiantesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Estudiantes</h1>
      <main className='py-4'>
        {'type' in data && data.type === 'error' && (
          <p>Ocurrió un error cargando los datos</p>
        )}
        {!('type' in data) && (
          <DataTable columns={estudiantesColumns} data={data} />
        )}
      </main>
    </>
  );
}
