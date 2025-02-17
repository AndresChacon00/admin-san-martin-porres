import { MetaFunction, useLoaderData } from '@remix-run/react';
import { getCursos } from '~/api/controllers/cursos';
import { cursoColumns } from '~/components/columns/cursos-columns';
import { DataTable } from '~/components/ui/data-table';

export const meta: MetaFunction = () => {
  return [{ title: 'Cursos | San Martín de Porres' }];
};

export async function loader() {
  const data = await getCursos();
  return data;
}

export default function CursosPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Cursos</h1>
      <main className='py-4'>
        {'type' in data && data.type === 'error' && (
          <p>Ocurrió un error cargando los datos</p>
        )}
        {!('type' in data) && (
          <DataTable columns={cursoColumns} data={data} />
        )}
      </main>
    </>
  );
}
