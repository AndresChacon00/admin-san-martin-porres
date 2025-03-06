import { Link, MetaFunction, useLoaderData, Form } from '@remix-run/react';
import { getEmpleados, addEmpleado } from '~/api/controllers/empleados.server';
import { empleadoColumns } from '~/components/columns/empleados-columns';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { writeFile } from 'xlsx';
import { exportEmpleados } from '~/lib/exporters';
import { importEmpleados } from '~/lib/importers';
import { useRef } from 'react';

export const meta: MetaFunction = () => {
  return [{ title: 'Empleados | San Martín de Porres' }];
};

export async function loader() {
  const data = await getEmpleados();
  return data;
}

export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const empleados = importEmpleados(arrayBuffer);
      for (const empleado of empleados) {
        await addEmpleado(empleado);
      }
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error occurred' };
  }
}

export default function EmpleadosPage() {
  const data = useLoaderData<typeof loader>();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if ('type' in data) return;
    const workbook = exportEmpleados(data);
    writeFile(workbook, 'empleados.xlsx', { compression: true });
  };

  const handleFileChange = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };  

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
          <Form method="post" encType="multipart/form-data" ref={formRef}>
            <input
              type="file"
              name="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              className="link-button !bg-green-600 hover:!bg-green-700"
              onClick={() => fileInputRef.current?.click()}
            >
              Importar desde Excel
            </Button>
          </Form>
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
