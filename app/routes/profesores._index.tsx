import {
  Link,
  MetaFunction,
  useFetcher,
  useLoaderData,
} from '@remix-run/react';
import { writeFile } from 'xlsx';
import { deleteProfesor, getProfesores } from '~/api/controllers/profesores';
import { empleadoColumns } from '~/components/columns/empleados-columns';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/data-tables/empleados-data-table';
import { exportEmpleados } from '~/lib/exporters';
import { ActionFunctionArgs } from '@remix-run/node';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const meta: MetaFunction = () => {
  return [{ title: 'Profesores | San Martín de Porres' }];
};

export async function loader() {
  const data = await getProfesores();
  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  let _action = formData.get('_action');
  if (!_action) {
    return {
      type: 'error',
      message: 'Suministre una acción',
    } as const;
  }

  _action = String(_action);
  if (_action === 'delete') {
    const profesorId = formData.get('profesorId');
    if (!profesorId) {
      return {
        type: 'error',
        message: 'Especifique el empleado a eliminar',
      } as const;
    }
    return deleteProfesor(Number(profesorId));
  }
}

export default function ProfesoresPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const handleExport = () => {
    if ('type' in data) return;
    const workbook = exportEmpleados(data);
    writeFile(workbook, 'profesores.xlsx', { compression: true });
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      if (fetcher.data.type === 'success') {
        toast.success('Profesor eliminado del sistema');
      } else if (fetcher.data.type === 'error') {
        toast.error('Ocurrió un error eliminando el profesor');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

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
            <DataTable
              columns={empleadoColumns}
              data={data}
              deleteEmployee={(id) =>
                fetcher.submit(
                  { _action: 'delete', profesorId: id },
                  { method: 'POST', action: '/profesores' },
                )
              }
            />
          )}
        </div>
      </main>
    </>
  );
}
