import {
  Link,
  MetaFunction,
  useFetcher,
  useLoaderData,
} from '@remix-run/react';
import {
  deleteEmpleado,
  getEmpleados,
} from '~/api/controllers/empleados.server';
import { empleadoColumns } from '~/components/columns/empleados-columns';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/data-tables/empleados-data-table';
import { writeFile } from 'xlsx';
import { exportEmpleados } from '~/lib/exporters';
import { ActionFunctionArgs } from '@remix-run/node';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const meta: MetaFunction = () => {
  return [{ title: 'Empleados | San Martín de Porres' }];
};

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
    const employeeId = formData.get('employeeId');
    if (!employeeId) {
      return {
        type: 'error',
        message: 'Especifique el empleado a eliminar',
      } as const;
    }
    return deleteEmpleado(Number(employeeId));
  }
}

export async function loader() {
  const data = await getEmpleados();
  return data;
}

export default function EmpleadosPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const handleExport = () => {
    if ('type' in data) return;
    const workbook = exportEmpleados(data);
    writeFile(workbook, 'empleados.xlsx', { compression: true });
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      if (fetcher.data.type === 'success') {
        toast.success('Empleado eliminado del sistema');
      } else if (fetcher.data.type === 'error') {
        toast.error('Ocurrió un error eliminando el empleado');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <h1 className='text-xl font-bold'>Empleados</h1>
      <main className='py-4 w-3/4'>
        <div className='flex gap-2'>
          <Link to='nuevo' className='link-button'>
            Registrar empleado
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
              deleteEmployee={(id) => {
                fetcher.submit(
                  { _action: 'delete', employeeId: id },
                  { method: 'POST', action: '/empleados' },
                );
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}
