import {
  useLoaderData,
  useParams,
  Link,
  MetaFunction,
  useFetcher,
} from '@remix-run/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  obtenerEstudiantesDeCursoPeriodo,
  inscribirEstudianteCursoPeriodo,
  eliminarEstudianteCursoPeriodo,
} from '~/api/controllers/estudiantesCursoPeriodo';
import { getAllEstudiantes } from '~/api/services/estudiantes';
import { getCursoById } from '~/api/controllers/cursos';
import {
  registrarPago,
  editarPago,
  calcularDeuda,
  eliminarPago,
} from '~/api/controllers/pagosEstudiantesCursos';
import { EstudiantesCursoDataTable } from '~/components/data-tables/estudiantesCurso-data-table';
import { estudiantesCursoColumns } from '~/components/columns/estudiantesCurso-columns';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select';
// ...existing code... (Input removed)
import { GenerarRelacionParticipantesDialog } from '~/components/Planillas/GenerarRelacionParticipantesDialog';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Periodos | San Martín de Porres' }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const idPeriodo = params.idPeriodo as string | undefined;
  const codigoCurso = params.codigo as string | undefined;

  if (!idPeriodo || !codigoCurso) {
    throw new Response('Datos inválidos', { status: 400 });
  }
  const estudiantes = await obtenerEstudiantesDeCursoPeriodo(
    idPeriodo,
    codigoCurso,
  );

  // Load course details to show the course name in the header
  const curso = await getCursoById(codigoCurso);

  // Load all estudiantes for the select when inscribing
  const todosEstudiantes = await getAllEstudiantes();

  // Si el controlador devolvió un error, retornar arreglo vacío para evitar errores de mapeo
  if (!Array.isArray(estudiantes)) {
    console.error('Error al obtener estudiantes:', estudiantes);
    return [];
  }

  // Calcular la deuda para cada estudiante
  const estudiantesConDeuda = await Promise.all(
    estudiantes.map(async (estudiante) => {
      if (!estudiante.cedula) {
        console.error('El estudiante no tiene una cédula válida:', estudiante);
        return { ...estudiante, deuda: 0 };
      }

      const deudaResult = await calcularDeuda({
        idPeriodo,
        codigoCurso,
        cedulaEstudiante: estudiante.cedula,
      });

      const deuda = deudaResult.type === 'success' ? deudaResult.deuda : 0;

      return {
        ...estudiante,
        deuda,
      };
    }),
  );

  return { estudiantes: estudiantesConDeuda, todosEstudiantes, curso };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get('actionType');
  const idPeriodo = params.idPeriodo as string | undefined;
  const codigoCurso = params.codigo as string | undefined;

  if (!codigoCurso || !idPeriodo) {
    return { error: 'Datos inválidos' };
  }

  // Inscribir estudiante por cédula (cliente envía actionType='inscribir')
  if (actionType === 'inscribir') {
    const cedula = String(formData.get('cedula') || '');

    if (!cedula) {
      return { error: 'Cédula inválida' };
    }

    const result = await inscribirEstudianteCursoPeriodo({
      idPeriodo: String(idPeriodo),
      codigoCurso: String(codigoCurso),
      cedulaEstudiante: cedula,
    });

    if (result.type === 'error') {
      return { error: result.message };
    }
    // Return structured success as JSON so client fetcher can detect and close dialogs
    return json({ type: 'success', message: 'Estudiante inscrito en el curso' });
  }

  if (actionType === 'agregar') {
    // cedula is sent as idEstudiante from the modal
    const cedula = String(formData.get('idEstudiante') || '');
    const monto = Number(formData.get('monto'));
    const fecha = formData.get('fecha') as string;
    const tipoPago = formData.get('tipoPago') as string;
    const comprobante = formData.get('comprobante') as string;

    if (!cedula || isNaN(monto) || !fecha || !tipoPago) {
      return { error: 'Datos inválidos' };
    }

    const result = await registrarPago({
      idPeriodo: String(idPeriodo),
      codigoCurso: String(codigoCurso),
      cedulaEstudiante: cedula,
      monto,
      fecha: new Date(fecha),
      tipoPago,
      comprobante,
    });

    if (result.type === 'error') {
      return json({ type: 'error', message: result.message });
    }
    return json({ type: 'success', message: 'Pago registrado' });
  }

  if (actionType === 'editar') {
    const idPago = Number(formData.get('idPago'));
    const monto = Number(formData.get('monto'));
    const fecha = formData.get('fecha') as string;
    const tipoPago = formData.get('tipoPago') as string;
    const comprobante = formData.get('comprobante') as string;

    if (isNaN(idPago) || isNaN(monto) || !fecha || !tipoPago) {
      return { error: 'Datos inválidos' };
    }

    const result = await editarPago(idPago, {
      monto,
      fecha: new Date(fecha),
      tipoPago,
      comprobante,
    });

    if (result.type === 'error') {
      return { error: result.message };
    }
  }

  if (actionType === 'eliminarEstudiante') {
    const cedula = String(formData.get('cedula') || '');

    if (!cedula) {
      return { error: 'Cédula de estudiante inválida' };
    }

    const result = await eliminarEstudianteCursoPeriodo(
      idPeriodo,
      codigoCurso,
      cedula,
    );

    if (result.type === 'error') {
      return { error: result.message };
    }
  }

  if (actionType === 'eliminar') {
    const idPago = Number(formData.get('idPago'));

    if (isNaN(idPago)) {
      return { error: 'ID de pago inválido' };
    }

    const result = await eliminarPago(idPago);

    if (result.type === 'error') {
      return { error: result.message };
    }
  }

  return null;
};

export default function EstudiantesCursoPage() {
  const { estudiantes: estudiantesInscritos, todosEstudiantes, curso } =
    useLoaderData<typeof loader>();
  const { idPeriodo, codigo } = useParams();

  return (
    <>
      <h1 className='text-xl font-bold'>
        Estudiantes en el Curso {curso?.nombreCurso ?? codigo} - Periodo {idPeriodo}
      </h1>
      <div className='py-4 w-3/4'>
        <div className='flex gap-4'>
          {/* Inscribir Estudiante dialog (controlled) */}
          <InscribirEstudianteDialog
            todosEstudiantes={todosEstudiantes}
            idPeriodo={String(idPeriodo)}
            codigoCurso={String(codigo)}
          />
          {/* Botón para generar la planilla (cliente) */}
          <GenerarRelacionParticipantesDialog
            idPeriodo={String(idPeriodo)}
            codigoCurso={String(codigo)}
            estudiantesInscritos={estudiantesInscritos}
            curso={{ nombreCurso: String(codigo) }}
          />
          {/* Nuevo botón para ver todos los pagos */}
          <Link to={`./pagos`}>
            <Button className='link-button'>Ver todos los pagos</Button>
          </Link>
        </div>
        <main className='py-4'>
          <EstudiantesCursoDataTable
            columns={estudiantesCursoColumns}
            data={estudiantesInscritos}
            idPeriodo={String(idPeriodo)}
            codigoCurso={String(codigo)}
          />
        </main>
      </div>
    </>
  );
}

function InscribirEstudianteDialog({
  todosEstudiantes,
  idPeriodo,
  codigoCurso,
}: {
  todosEstudiantes: { cedula: string; nombre: string; apellido: string }[];
  idPeriodo: string;
  codigoCurso: string;
}) {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const [selectedCedula, setSelectedCedula] = useState('');
  const [filter, setFilter] = useState('');

  type FetcherResponse =
    | { type: 'success' | 'error'; message?: string }
    | { success?: boolean; error?: string };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (fetcher.state === 'idle' && fetcher.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = fetcher.data as any as FetcherResponse;
      // Close on structured success
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (data && 'type' in data && data.type === 'success') {
  toast.success('Estudiante inscrito');
        setOpen(false);
        try {
          fetcher.load(window.location.pathname);
        } catch (e) {
          // ignore
        }
  } else if (data && 'success' in data && data.success === true) {
        toast.success('Estudiante inscrito');
        setOpen(false);
        try {
          fetcher.load(window.location.pathname);
        } catch (e) {
          // ignore
        }
      } else if (data && 'type' in data && data.type === 'error') {
        toast.error(data.message || 'Error al inscribir');
      } else if (data && 'error' in data && data.error) {
        toast.error(String(data.error));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    form.append('actionType', 'inscribir');
    form.append('idPeriodo', idPeriodo);
    form.append('codigoCurso', codigoCurso);
    fetcher.submit(form, { method: 'post' });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button className='link-button'>Inscribir Estudiante</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inscribir Estudiante</DialogTitle>
          <DialogDescription>
            Ingresa la cédula del estudiante que deseas inscribir en este
            curso.
          </DialogDescription>
        </DialogHeader>
        <fetcher.Form method='post' onSubmit={handleSubmit}>
          <Label htmlFor='cedula'>Selecciona Estudiante</Label>
          <div className='mb-2'>
            <input
              type='text'
              placeholder='Buscar por cédula o nombre...'
              className='w-full rounded border px-2 py-1'
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <input type='hidden' name='cedula' value={selectedCedula} />
          <div className='mb-4'>
            <Select onValueChange={(v) => setSelectedCedula(String(v))} defaultValue={selectedCedula}>
              <SelectTrigger id='cedula'>
                <SelectValue placeholder='-- Selecciona un estudiante --' />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(todosEstudiantes) &&
                  todosEstudiantes
                    .filter((e) => {
                      if (!filter) return true;
                      const q = filter.toLowerCase();
                      return (
                        String(e.cedula).toLowerCase().includes(q) ||
                        String(e.nombre).toLowerCase().includes(q) ||
                        String(e.apellido).toLowerCase().includes(q)
                      );
                    })
                    .map((e) => (
                      <SelectItem key={e.cedula} value={String(e.cedula)}>
                        {`${e.cedula} - ${e.nombre} ${e.apellido}`}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type='submit' className='link-button'>Inscribir Estudiante</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
