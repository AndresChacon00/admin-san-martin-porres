import { useLoaderData, useParams, MetaFunction, useFetcher, useRevalidator } from '@remix-run/react';
import {
  obtenerCursosPorPeriodo,
  inscribirCursoEnPeriodo,
  eliminarCursoDePeriodo,
} from '~/api/controllers/cursosPeriodo';
import { getCursos } from '~/api/controllers/cursos';
import { cursoColumns } from '~/components/columns/cursos-columns';
import { CursosPeriodosDataTable } from '~/components/data-tables/cursosPeriodo-data-table'; // Import the custom data table
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
import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { useState } from 'react';
import { toast } from 'sonner';

export const loader: LoaderFunction = async ({ params }) => {
  const idPeriodo = String(params.idPeriodo);
  if (!idPeriodo) {
    return { type: 'error', message: 'ID de periodo inválido' };
  }
  const cursosInscritos = await obtenerCursosPorPeriodo(idPeriodo);
  // also fetch all cursos so we can show available ones in the select
  const allCursos = await getCursos();

  // if either returned an error, just return the inscritos response so the page shows an error
  if ('type' in cursosInscritos && cursosInscritos.type === 'error') {
    return cursosInscritos;
  }

  // compute available courses by codigo
  const inscritosCodigos = new Set((cursosInscritos as any[]).map((c: any) => String(c.codigo)));
  const available = Array.isArray(allCursos)
    ? (allCursos as any[]).filter((c: any) => !inscritosCodigos.has(String(c.codigo)))
    : [];

  return { inscritos: cursosInscritos, available };
};

export const meta: MetaFunction = () => {
  return [{ title: 'Periodos | San Martín de Porres' }];
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get('actionType');
  const idPeriodo = String(params.idPeriodo);

  if (!idPeriodo) {
    return { error: 'ID de periodo inválido' };
  }

  if (actionType === 'inscribirCurso') {
    const idCursoRaw = formData.get('idCurso');
    const horario = String(formData.get('horario'));

    if (!idCursoRaw || !horario) {
      return { error: 'Datos inválidos' };
    }

    const idCurso = String(idCursoRaw);
    return await inscribirCursoEnPeriodo(idPeriodo, idCurso, horario);
  }

  if (actionType === 'eliminarCursoPeriodo') {
    const codigoCurso = formData.get('codigoCurso');

    if (!codigoCurso) {
      return { error: 'Código del curso inválido' };
    }

    return await eliminarCursoDePeriodo(idPeriodo, String(codigoCurso));
  }

  return { error: 'Acción no válida' };
};

export default function CursosPeriodoPage() {
  const loaderData = useLoaderData<typeof loader>();
  // loader now returns either an error shape, or { inscritos, available }
  const cursosInscritos = 'inscritos' in loaderData ? (loaderData as any).inscritos : loaderData;
  const availableCursos = 'available' in loaderData ? (loaderData as any).available : [];
  const { idPeriodo } = useParams();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [openInscribir, setOpenInscribir] = useState(false);

  return (
    <>
      <h1 className='text-xl font-bold'>Cursos en el Periodo {idPeriodo}</h1>

      {/* Botón para abrir el diálogo de inscripción */}
      <div className='py-4 w-3/4'>
        <Dialog open={openInscribir} onOpenChange={setOpenInscribir}>
          <DialogTrigger asChild>
            <Button className='link-button' onClick={() => setOpenInscribir(true)}>Inscribir Curso</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inscribir Curso</DialogTitle>
              <DialogDescription>
                Selecciona el curso que deseas agregar a este periodo.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);
                fd.append('actionType', 'inscribirCurso');
                const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
                if (submitBtn) submitBtn.disabled = true;
                try {
                  const res = await fetch(window.location.pathname, {
                    method: 'POST',
                    body: fd,
                    headers: {
                      Accept: 'application/json',
                      'X-Requested-With': 'XMLHttpRequest',
                    },
                  });

                  if (res.status < 400) {
                    const data = await res.json().catch(() => undefined);
                    toast.success((data && (data.message || data.msg)) || 'Curso inscrito');
                    try {
                      window.dispatchEvent(new Event('refreshPeriodos'));
                    } catch (_) {}
                    fetcher.load(window.location.pathname);
                    try {
                      revalidator.revalidate();
                    } catch (_) {}
                    setOpenInscribir(false);
                  } else {
                    const data = await res.json().catch(() => undefined);
                    const text = await res.text().catch(() => '');
                    toast.error((data && (data.message || data.msg)) || text || 'Error inscribiendo curso');
                  }
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('Error inscribiendo curso', err);
                  toast.error('Error inscribiendo curso');
                } finally {
                  if (submitBtn) submitBtn.disabled = false;
                }
              }}
            >
              <input type='hidden' name='actionType' value='inscribirCurso' />
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='idCurso' className='text-right'>
                    Curso
                  </Label>
                  <select id='idCurso' name='idCurso' className='col-span-3 rounded border px-2 py-1'>
                    <option value=''>-- Selecciona un curso --</option>
                    {Array.isArray(availableCursos) && availableCursos.map((c: any) => (
                      <option key={c.codigo} value={c.codigo}>{c.nombreCurso}</option>
                    ))}
                  </select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='horario' className='text-right'>
                    Turno
                  </Label>
                  <div className='col-span-3 flex items-center gap-4'>
                    <div>
                      <label className='inline-flex items-center gap-2'>
                        <input type='radio' name='horario' value='M' />
                        <span>Mañana</span>
                      </label>
                    </div>
                    <div>
                      <label className='inline-flex items-center gap-2'>
                        <input type='radio' name='horario' value='T' />
                        <span>Tarde</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className='link-button'>Inscribir Curso</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      {/* Tabla de cursos inscritos en este periodo */}
      <main className="py-4">
        {'type' in cursosInscritos && cursosInscritos.type === 'error' ? (
          <p>Ocurrió un error cargando los cursos</p>
        ) : (
          <CursosPeriodosDataTable
              columns={cursoColumns} // Pass the base columns
              data={cursosInscritos} // Pass the data from the loader
              idPeriodo={String(idPeriodo)} // Pass the period ID as string
            />
          )}
        </main>
      </div>
    </>
  );
}
