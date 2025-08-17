import {
  Link,
  MetaFunction,
  useFetcher,
  useLoaderData,
} from '@remix-run/react';
import {
  deleteEmpleado,
  getEmpleados,
  addEmpleado,
} from '~/api/controllers/empleados.server';
import { empleadoColumns } from '~/components/columns/empleados-columns';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/data-tables/empleados-data-table';
import { writeFile } from 'xlsx';
import { exportEmpleados } from '~/lib/exporters';
import { importEmpleados } from '~/lib/importers';
import { useRef, useState, useEffect } from 'react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { toast } from 'sonner';
import { isRole } from '~/lib/auth';
import { getTitulos } from '~/api/controllers/titulos.server';
import { getGrados } from '~/api/controllers/grados.server';
import { getCargos } from '~/api/controllers/cargos.server';
import { getNiveles } from '~/api/controllers/niveles.server';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog';

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

  if (_action === 'import') {
    try {
      const file = formData.get('file') as File;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const empleados = importEmpleados(arrayBuffer);
        const [titulos, grados, cargos, niveles] = await Promise.all([
          getTitulos(),
          getGrados(),
          getCargos(),
          getNiveles(),
        ]);
        for (const empleado of empleados) {
          const titulo =
            titulos.find((t) => t.codigo === empleado.titulo)?.id || 0;
          const grado =
            grados.find((g) => g.codigo === empleado.gradoSistema)?.id || 0;
          const cargo =
            cargos.find((c) => c.nombreCargo === empleado.cargo)?.id || 0;
          const nivel =
            niveles.find((n) => n.nombre === empleado.nivelSistema)?.id || 0;
          if (!titulo || !grado || !cargo || !nivel) {
            console.log({
              empleado,
              titulo,
              grado,
              cargo,
              nivel,
            });
            return {
              type: 'error',
              message: `Datos incompletos para el empleado ${empleado.nombreCompleto}. Asegúrese de que los códigos de título, grado, cargo y nivel existan en el sistema.`,
            } as const;
          }
          await addEmpleado({
            ...empleado,
            titulo,
            gradoSistema: grado,
            gradoCentro: grado,
            cargo,
            nivelSistema: nivel,
            nivelCentro: nivel,
          });
        }
      }
      return { type: 'success', message: 'Datos cargados con éxito' };
    } catch (error) {
      if (error instanceof Error) {
        return { type: 'error', message: error.message };
      }
      return { type: 'error', message: 'Ocurrió un error' };
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }
  const data = await getEmpleados();
  return data;
}

export default function EmpleadosPage() {
  const data = useLoaderData<typeof loader>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<typeof action>();
  const importFetcher = useFetcher<typeof action>();
  const [showImportDialog, setShowImportDialog] = useState(false);

  const camposImport = [
    { nombre: 'Nombre completo', tipo: 'texto' },
    { nombre: 'Cédula', tipo: 'texto' },
    { nombre: 'Fecha de nacimiento', tipo: 'fecha' },
    { nombre: 'Sexo', tipo: 'F | M' },
    { nombre: 'Estado Civil', tipo: 'S | C | D | V | R' },
    { nombre: 'Religión', tipo: 'texto' },
    { nombre: 'Cantidad de hijos menores de seis años', tipo: 'número' },
    { nombre: 'Monto mensual por guardería', tipo: 'número' },
    { nombre: 'Fecha de ingreso en AVEC', tipo: 'fecha' },
    { nombre: 'Fecha de ingreso en el Plantel', tipo: 'fecha' },
    { nombre: 'Título', tipo: 'texto (código)' },
    { nombre: 'Descripción del título', tipo: 'texto o Ninguno' },
    { nombre: 'Mención del título', tipo: 'texto o Ninguno' },
    { nombre: 'Carrera estudiando', tipo: 'texto o Ninguno' },
    { nombre: 'Tipo de lapso de estudios', tipo: 'texto o Ninguno' },
    { nombre: 'Número de lapsos aprobados', tipo: 'número o Ninguno' },
    {
      nombre: 'Postgrado',
      tipo: 'POSTGRADO EN ESPECIALIDAD | MAESTRIA | DOCTORADO | Ninguno',
    },
    { nombre: 'Experiencia laboral', tipo: 'número' },
    { nombre: 'Grado en el sistema', tipo: 'texto (código)' },
    { nombre: 'Nivel en el sistema', tipo: 'texto (nombre)' },
    { nombre: 'Grado en el centro', tipo: 'texto (código)' },
    { nombre: 'Nivel en el centro', tipo: 'texto (nombre)' },
    { nombre: 'Cargo', tipo: 'texto (nombre)' },
    { nombre: 'Horas semanales', tipo: 'número' },
    { nombre: 'Sueldo', tipo: 'número' },
    { nombre: 'Cantidad de hijos', tipo: 'número' },
    { nombre: 'Contribución por discapacidad', tipo: 'número' },
    { nombre: 'Contribución por discapacidad de hijos', tipo: 'número' },
    { nombre: 'Pago directo', tipo: 'SI | NO' },
    { nombre: 'Jubilado', tipo: 'SI | NO' },
    { nombre: 'Cuenta bancaria', tipo: 'texto o Ninguno' },
    { nombre: 'Observaciones', tipo: 'texto o Ninguno' },
    { nombre: 'Fecha de registro', tipo: 'fecha' },
    { nombre: 'Fecha de actualización', tipo: 'fecha' },
  ];

  const handleExport = () => {
    if ('type' in data) return;
    const workbook = exportEmpleados(data);
    writeFile(workbook, 'empleados.xlsx', { compression: true });
  };

  const handleFileChange = () => {
    const formData = new FormData();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Seleccione un archivo para importar');
      return;
    }
    formData.append('file', file);
    formData.append('_action', 'import');
    importFetcher.submit(formData, {
      method: 'post',
      encType: 'multipart/form-data',
      action: '/empleados',
    });
  };

  const handleImportClick = () => {
    setShowImportDialog(true);
  };

  const handleDialogFileClick = () => {
    setShowImportDialog(false);
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.type === 'success') {
        toast.success('Empleado eliminado del sistema');
      } else if (fetcher.data.type === 'error') {
        toast.error('Ocurrió un error eliminando el empleado');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (importFetcher.state === 'idle' && importFetcher.data) {
      if (importFetcher.data.type === 'success') {
        toast.success('Empleados importados con éxito');
      } else if (importFetcher.data.type === 'error') {
        toast.error(
          'Ocurrió un error importando los empleados: ' +
            importFetcher.data.message,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importFetcher.state, importFetcher.data]);

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
          <Button
            type='button'
            className='link-button !bg-green-600 hover:!bg-green-700'
            onClick={handleImportClick}
          >
            {importFetcher.state === 'submitting' ? (
              <>
                Subiendo...
                <div role='status' className='flex justify-center items-center'>
                  <svg
                    aria-hidden='true'
                    className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                  <span className='sr-only'>Subiendo...</span>
                </div>
              </>
            ) : (
              'Importar desde Excel'
            )}
          </Button>
          <input
            type='file'
            name='file'
            className='hidden'
            ref={fileInputRef}
            onChange={handleFileChange}
          />
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
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className='max-h-[95vh] overflow-y-auto flex flex-col'>
          <DialogHeader>
            <DialogTitle>Importar empleados desde Excel</DialogTitle>
          </DialogHeader>
          <div className='mb-2 flex-1 overflow-y-auto'>
            <p>El archivo debe tener los siguientes campos en este orden:</p>
            <ul className='list-disc ml-6 mt-2'>
              {camposImport.map((campo) => (
                <li key={campo.nombre} className='mb-1'>
                  <strong>{campo.nombre}</strong>:{' '}
                  <span className='text-gray-600'>{campo.tipo}</span>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter className='sticky bottom-0 bg-white pt-2'>
            <Button
              type='button'
              className='link-button !bg-green-600 hover:!bg-green-700'
              onClick={handleDialogFileClick}
            >
              Seleccionar archivo Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
