import {
  useLoaderData,
  MetaFunction,
  redirect,
  useActionData,
  useFetcher,
  useRevalidator,
} from '@remix-run/react';

import {
  addCurso,
  deleteCurso,
  getCursos,
  updateCurso,
} from '~/api/controllers/cursos';
import { cursoColumns } from '~/components/columns/cursos-columns';
import { DataTableCursos } from '~/components/data-tables/cursos-data-table';
// modals are rendered by the DataTableCursos component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { ActionFunction, json } from '@remix-run/node';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const meta: MetaFunction = () => {
  return [{ title: 'Cursos | San Martín de Porres' }];
};

export async function loader() {
  const data = await getCursos();
  return data;
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const accept = request.headers.get('accept') || '';
    const xreq = request.headers.get('x-requested-with') || '';
    const wantsJson = accept.includes('application/json') || xreq === 'XMLHttpRequest';

    if (actionType === 'agregar') {
      const codigo = formData.get('codigo');
      const nombreCurso = formData.get('nombreCurso');
      const descripcion = formData.get('descripcion');
      const estado = Number(formData.get('estado'));
  const precioTotal = Number(formData.get('precioTotal'));

      // codigo can be omitted; the service will generate one if missing.
      if (
        typeof nombreCurso !== 'string' ||
        typeof descripcion !== 'string' ||
        isNaN(estado) ||
        isNaN(precioTotal) ||
        precioTotal < 0
      ) {
        if (wantsJson) return json({ type: 'error', message: 'Datos inválidos' }, { status: 400 });
        return json({ error: 'Datos inválidos' }, { status: 400 });
      }

      const cursoPayload: any = {
        nombreCurso,
        descripcion,
        estado,
        precioTotal,
      };
      if (typeof codigo === 'string' && codigo.trim() !== '') cursoPayload.codigo = codigo;

      await addCurso(cursoPayload);

      if (wantsJson) return json({ type: 'success', message: 'Curso agregado' });
    }

    if (actionType === 'editar') {
      const codigo = formData.get('codigo');
      const nombreCurso = formData.get('nombreCurso');
      const descripcion = formData.get('descripcion');
      const estado = Number(formData.get('estado'));
      const precioTotal = Number(formData.get('precioTotal'));

      if (
        typeof codigo !== 'string' ||
        typeof nombreCurso !== 'string' ||
        typeof descripcion !== 'string' ||
        isNaN(estado) ||
        isNaN(precioTotal) ||
        precioTotal < 0
      ) {
        if (wantsJson) return json({ type: 'error', message: 'Datos inválidos' }, { status: 400 });
        return json({ error: 'Datos inválidos' }, { status: 400 });
      }

      await updateCurso(codigo, {
        nombreCurso,
        descripcion,
        estado,
        precioTotal,
      });

      if (wantsJson) return json({ type: 'success', message: 'Curso actualizado' });
    }

    if (actionType === 'eliminar') {
      const codigo = formData.get('codigo');

      if (typeof codigo !== 'string') {
        if (wantsJson) return json({ type: 'error', message: 'Código inválido' }, { status: 400 });
        return json({ error: 'Código inválido' }, { status: 400 });
      }

      await deleteCurso(codigo);

      if (wantsJson) return json({ type: 'success', message: 'Curso eliminado' });
    }

    return redirect('/cursos');
  } catch (err: unknown) {
    console.error('Unhandled error in cursos action:', err);
    const msg = err instanceof Error ? err.message : String(err);
    const raw = (err as unknown as { raw?: string })?.raw || '';
    return new Response(JSON.stringify({ type: 'error', message: msg, raw }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Error-Message': msg,
        'X-Raw-Error': raw,
      },
    });
  }
};

export default function CursosPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const revalidator = useRevalidator();

  useEffect(() => {
    const maybeData = (fetcher as unknown as { data?: unknown }).data;
    if (fetcher.state === 'idle' && maybeData) {
      const d = maybeData as { type?: string; message?: string } | undefined;
      if (d?.type === 'success' || d?.type === 'succes') {
        toast.success(d.message || 'Curso agregado');
        setOpen(false);
      } else if (d?.type === 'error') {
        toast.error(d.message || 'Ocurrió un error');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, (fetcher as unknown as { data?: unknown }).data]);

  // Listen for custom refresh events so child modals can ask the page to reload
  useEffect(() => {
    const handler = () => {
      fetcher.load(window.location.pathname);
      try {
        revalidator.revalidate();
      } catch (_) {
        // ignore if revalidator is not functional in this environment
      }
    };
    window.addEventListener('refreshCursos', handler);
    return () => window.removeEventListener('refreshCursos', handler);
  }, [fetcher, revalidator]);

  return (
    <>
      <h1 className='text-xl font-bold'>Cursos</h1>
      <div className='py-4 w-3/4'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='link-button' onClick={() => setOpen(true)}>Agregar Curso </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Curso</DialogTitle>
              <DialogDescription>
                Agrega un nuevo curso a la lista.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsAdding(true);
                try {
                  const form = e.currentTarget as HTMLFormElement;
                  const fd = new FormData(form);
                  fd.append('actionType', 'agregar');

                  const res = await fetch(window.location.pathname, {
                    method: 'POST',
                    body: fd,
                    headers: {
                      Accept: 'application/json',
                      'X-Requested-With': 'XMLHttpRequest',
                    },
                  });

                  if (res.status < 400) {
                    const data = (await res.json().catch(() => undefined)) as
                      | { message?: string }
                      | undefined;
                    toast.success(data?.message || 'Curso agregado');
                    // tell the page to refresh its loader
                    try {
                      window.dispatchEvent(new Event('refreshCursos'));
                    } catch (_) {
                      // ignore
                    }
                    fetcher.load(window.location.pathname);
                    setOpen(false);
                  } else {
                    const data = (await res.json().catch(() => undefined)) as
                      | { message?: string }
                      | undefined;
                    const text = await res.text().catch(() => '');
                    toast.error(data?.message || text || 'Error agregando curso');
                  }
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('Error agregando curso', err);
                  toast.error('Error agregando curso');
                } finally {
                  setIsAdding(false);
                }
              }}
            >
              <input type='hidden' name='actionType' value='agregar' />
              <div className='grid gap-4 py-4'>
                {/* Código */}
                  {/* Código: se generará automáticamente en el servidor (no es necesario completar) */}
                {/* Nombre del Curso */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='nombreCurso' className='text-right'>
                    Nombre del Curso
                  </Label>
                  <Input
                    id='nombreCurso'
                    name='nombreCurso'
                    className='col-span-3'
                  />
                </div>
                {/* Descripción */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='descripcion' className='text-right'>
                    Descripción
                  </Label>
                  <Input
                    id='descripcion'
                    name='descripcion'
                    className='col-span-3'
                  />
                </div>
                {/* Estado (removed from UI) */}
                <input type='hidden' name='estado' value='1' />
                {/* Matrícula (REF) */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='precioTotal' className='text-right'>
                    Matrícula (REF)
                  </Label>
                  <Input
                    id='precioTotal'
                    name='precioTotal'
                    type='number'
                    min='0'
                    step='0.01'
                    className='col-span-3'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit' className='link-button' disabled={isAdding}>
                  {isAdding ? 'Agregando...' : 'Agregar Curso'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <main className='py-4 px-4'>
          {'type' in data && data.type === 'error' && (
            <p>Ocurrió un error cargando los datos</p>
          )}
          {!('type' in data) && (
            <DataTableCursos columns={cursoColumns} data={data} />
          )}
        </main>
      </div>
    </>
  );
}
