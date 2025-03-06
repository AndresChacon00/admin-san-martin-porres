import { Link, MetaFunction, useLoaderData, Form, useNavigation } from '@remix-run/react';
import { writeFile } from 'xlsx';
import { getProfesores, addProfesor } from '~/api/controllers/profesores';
import { empleadoColumns } from '~/components/columns/empleados-columns';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { exportEmpleados } from '~/lib/exporters';
import { importEmpleados } from '~/lib/importers';
import { useRef, useState, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [{ title: 'Profesores | San Martín de Porres' }];
};

export async function loader() {
  const data = await getProfesores();
  return data;
}

export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const profesores = importEmpleados(arrayBuffer);
      for (const profesor of profesores) {
        await addProfesor(profesor);
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

export default function ProfesoresPage() {
  const data = useLoaderData<typeof loader>();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useNavigation();

  const handleExport = () => {
    if ('type' in data) return;
    const workbook = exportEmpleados(data);
    writeFile(workbook, 'profesores.xlsx', { compression: true });
  };

  const handleFileChange = () => {
    if (formRef.current) {
      setIsLoading(true);
      formRef.current.requestSubmit();
    }
  };
  
  useEffect(() => {
    if (state === 'submitting') {
      setIsLoading(true);
    } else if (state === 'idle') {
      setIsLoading(false);
    }
  }, [state]);

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
              {isLoading ? (
                <>
                  Subiendo...
                  <div role="status" className="flex justify-center items-center">
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                "Importar desde Excel"
              )}                           
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
