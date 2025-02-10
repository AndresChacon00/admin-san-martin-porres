import { MetaFunction, useLoaderData } from '@remix-run/react';
import { getEmpleados } from '~/api/controllers/empleados';
import { empleadoColumns } from '~/components/columns/empleados-columns';
import { DataTable } from '~/components/ui/data-table';

export const meta: MetaFunction = () => {
  return [{ title: 'Empleados | San Martín de Porres' }];
};

export async function loader() {
  const data = await getEmpleados();
  return data;
}

export default function EmpleadosPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Empleados</h1>
      <main className='py-4'>
        {'type' in data && data.type === 'error' && (
          <p>Ocurrió un error cargando los datos</p>
        )}
        {!('type' in data) && (
          <DataTable columns={empleadoColumns} data={data} />
        )}
      </main>
    </>
  );
}
