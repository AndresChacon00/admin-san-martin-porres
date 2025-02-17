import { Link, MetaFunction, useLoaderData } from '@remix-run/react';
import { getProfesores } from '~/api/controllers/profesores';
import { empleadoColumns } from '~/components/columns/empleados-columns';
import { DataTable } from '~/components/ui/data-table';

export const meta: MetaFunction = () => {
  return [{ title: 'Profesores | San Martín de Porres' }];
};

export async function loader() {
  const data = await getProfesores();
  return data;
}

export default function ProfesoresPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Profesores</h1>
      <main className='py-4 w-3/4'>
        <Link to='nuevo' className='link-button'>
          Registrar profesor
        </Link>
        <div className='mt-4'>
          {'type' in data && data.type === 'error' && (
            <p>Ocurrió un error cargando los datos</p>
          )}
          {!('type' in data) && (
            <DataTable columns={empleadoColumns} data={data} />
          )}
        </div>
      </main>
    </>
  );
}
