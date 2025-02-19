import { Link, MetaFunction, useLoaderData } from '@remix-run/react';
import { writeFile } from 'xlsx';
import { getProfesores } from '~/api/controllers/profesores';
import { empleadoColumns } from '~/components/columns/empleados-columns';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { exportEmpleados } from '~/lib/exporters';

export const meta: MetaFunction = () => {
  return [{ title: 'Profesores | San Martín de Porres' }];
};

export async function loader() {
  const data = await getProfesores();
  return data;
}

export default function ProfesoresPage() {
  const data = useLoaderData<typeof loader>();

  const handleExport = () => {
    if ('type' in data) return;
    const workbook = exportEmpleados(data);
    writeFile(workbook, 'profesores.xlsx', { compression: true });
  };

  return (
    <>
      <h1 className='text-xl font-bold'>Profesores</h1>
      <main className='py-4 w-3/4'>
        <div className='flex gap-2'>
          <Link to='nuevo' className='link-button'>
            Registrar profesor
          </Link>
          <Button
            className='link-button !bg-green-600 hover:!bg-green-700'
            onClick={handleExport}
          >
            Exportar a Excel
          </Button>
        </div>
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
