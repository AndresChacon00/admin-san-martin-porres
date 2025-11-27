import { useLoaderData, MetaFunction, useFetcher, useRevalidator } from '@remix-run/react';
import {
  addPeriodo,
  getPeriodos,
  updatePeriodo,
  deletePeriodo,
} from '~/api/controllers/periodos';
import { periodosColumns } from '~/components/columns/periodos-columns';
import { PeriodosDataTable } from '~/components/data-tables/periodos-data-table';
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
  return [{ title: 'Periodos | San Martín de Porres' }];
};

export async function loader() {
  const data = await getPeriodos();
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
      const idPeriodo = String(formData.get('idPeriodo'));
      const fechaInicio = formData.get('fechaInicio');
      const fechaFin = formData.get('fechaFin');

      if (
        idPeriodo == '' ||
        typeof fechaInicio !== 'string' ||
        typeof fechaFin !== 'string'
      ) {
        if (wantsJson) return json({ type: 'error', message: 'Datos inválidos' }, { status: 400 });
        return { error: 'Datos inválidos' };
      }

      // Validate that fechaFin is not before fechaInicio
      try {
        const d1 = new Date(String(fechaInicio));
        const d2 = new Date(String(fechaFin));
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
          if (wantsJson) return json({ type: 'error', message: 'Fechas inválidas' }, { status: 400 });
          return { error: 'Fechas inválidas' };
        }
        if (d2 < d1) {
          if (wantsJson) return json({ type: 'error', message: 'La fecha de fin debe ser posterior a la fecha de inicio' }, { status: 400 });
          return { error: 'La fecha de fin debe ser posterior a la fecha de inicio' };
        }
      } catch (e) {
        if (wantsJson) return json({ type: 'error', message: 'Fechas inválidas' }, { status: 400 });
        return { error: 'Fechas inválidas' };
      }

      const result = await addPeriodo({
        idPeriodo,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      });

      // If service/controller returned structured error, propagate it
      if (result && typeof result === 'object' && 'type' in result && (result as any).type === 'error') {
        const msg = (result as any).message || 'Error al añadir un periodo';
        if (wantsJson) return json({ type: 'error', message: msg }, { status: 400 });
        return { error: msg };
      }

      if (wantsJson) return json({ type: 'success', message: 'Periodo agregado' });
      return null;
    }

    if (actionType === 'editar') {
      const idPeriodoRaw = formData.get('idPeriodo');
      const fechaInicio = formData.get('fechaInicio');
      const fechaFin = formData.get('fechaFin');

      if (
        typeof idPeriodoRaw !== 'string' ||
        idPeriodoRaw.trim() === '' ||
        typeof fechaInicio !== 'string' ||
        typeof fechaFin !== 'string'
      ) {
        if (wantsJson) return json({ type: 'error', message: 'Datos inválidos' }, { status: 400 });
        return { error: 'Datos inválidos' };
      }

      // Validate dates when editing as well
      try {
        const d1 = new Date(String(fechaInicio));
        const d2 = new Date(String(fechaFin));
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
          if (wantsJson) return json({ type: 'error', message: 'Fechas inválidas' }, { status: 400 });
          return { error: 'Fechas inválidas' };
        }
        if (d2 < d1) {
          if (wantsJson) return json({ type: 'error', message: 'La fecha de fin debe ser posterior a la fecha de inicio' }, { status: 400 });
          return { error: 'La fecha de fin debe ser posterior a la fecha de inicio' };
        }
      } catch (e) {
        if (wantsJson) return json({ type: 'error', message: 'Fechas inválidas' }, { status: 400 });
        return { error: 'Fechas inválidas' };
      }

      await updatePeriodo(idPeriodoRaw, {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      });

      if (wantsJson) return json({ type: 'success', message: 'Periodo actualizado' });
      return null;
    }

    if (actionType === 'eliminar') {
      // idPeriodo is a string like '2025-2024' in this app; treat as string
      const idPeriodoRaw = formData.get('idPeriodo');
      if (typeof idPeriodoRaw !== 'string' || idPeriodoRaw.trim() === '') {
        if (wantsJson) return json({ type: 'error', message: 'ID inválido' }, { status: 400 });
        return { error: 'ID inválido' };
      }

      await deletePeriodo(idPeriodoRaw);

      if (wantsJson) return json({ type: 'success', message: 'Periodo eliminado' });
      return null;
    }

    if (wantsJson) return json({ type: 'error', message: 'Acción no válida' }, { status: 400 });
    return { error: 'Acción no válida' };
  } catch (err: unknown) {
    console.error('Unhandled error in periodos action:', err);
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

export default function PeriodosPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const maybeData = (fetcher as unknown as { data?: unknown }).data;
    if (fetcher.state === 'idle' && maybeData) {
      const d = maybeData as { type?: string; message?: string } | undefined;
      if (d && (d.type === 'success' || d.type === 'succes')) {
        toast.success(d.message || 'Periodo agregado');
        setOpen(false);
      } else if (d && d.type === 'error') {
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
    window.addEventListener('refreshPeriodos', handler);
    return () => window.removeEventListener('refreshPeriodos', handler);
  }, [fetcher, revalidator]);

  return (
    <>
      <h1 className='text-xl font-bold'>Periodos</h1>
      <div className='py-4 w-3/4'>
        {/* Agregar Periodo Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='link-button' onClick={() => setOpen(true)}>Agregar Periodo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Periodo</DialogTitle>
              <DialogDescription>
                Agrega un nuevo periodo al sistema.
              </DialogDescription>
            </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const fd = new FormData(form);
                  fd.append('actionType', 'agregar');
                  // Client-side validation: ensure fechaFin >= fechaInicio
                  const fi = fd.get('fechaInicio');
                  const ff = fd.get('fechaFin');
                  if (typeof fi === 'string' && typeof ff === 'string') {
                    const d1 = new Date(fi);
                    const d2 = new Date(ff);
                    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
                      toast.error('Fechas inválidas');
                      return;
                    }
                    if (d2 < d1) {
                      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
                      return;
                    }
                  }
                  const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
                  if (btn) btn.disabled = true;
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
                      const data = (await res.json().catch(() => undefined)) as
                        | { message?: string }
                        | undefined;
                      toast.success(data?.message || 'Periodo agregado');
                      try {
                        window.dispatchEvent(new Event('refreshPeriodos'));
                      } catch (_) {
                        // ignore
                      }
                      fetcher.load(window.location.pathname);
                      setOpen(false);
                    } else {
                      // Try robust extraction: prefer JSON.message, then headers, then text
                      let parsed: { message?: string; error?: string } | undefined;
                      try {
                        parsed = await res.clone().json();
                      } catch {
                        parsed = undefined;
                      }
                      const headerMsg =
                        res.headers.get('x-error-message') ||
                        res.headers.get('x-message') ||
                        res.headers.get('x-user-message');
                      let text = '';
                      try {
                        text = await res.text();
                      } catch {
                        text = '';
                      }
                      // If response is HTML (dev overlay or error page), avoid showing full HTML in toast
                      let msg = parsed?.message || parsed?.error || headerMsg || '';
                      const isHtml = /^ ?\s*<\!doctype\s+/i.test(text) || /<html[\s>]/i.test(text) || /<body[\s>]/i.test(text);
                      if (isHtml) {
                        // Try to extract our specific server message (e.g., "El id de periodo X ya está registrado")
                        const specificMatch = text.match(/El id de periodo\s*([\w-]+)\s+ya est[aá]\s+registrad/i);
                        if (specificMatch) {
                          msg = `El id de periodo ${specificMatch[1]} ya está registrado`;
                        } else {
                          // Try to detect SQLite UNIQUE constraint mentions
                          const uniqueMatch = text.match(/UNIQUE constraint failed:\s*([\w.]+)/i) || text.match(/UNIQUE constraint failed\s*:\s*([\w.\s,]+)/i);
                          if (uniqueMatch) {
                            const full = uniqueMatch[1];
                            const idMatch = full.match(/(?:\.|_)(idPeriodo|id_periodo|id-periodo)/i);
                            msg = idMatch ? `El id del periodo ya está registrado` : 'Error de constraint en la base de datos (valor duplicado)';
                          } else {
                            msg = 'Error agregando periodo (ver consola para detalles)';
                          }
                        }
                        // Log full HTML to console for debugging
                        // eslint-disable-next-line no-console
                        console.error('Agregar Periodo HTML response (truncated):', text.slice(0, 2000));
                      } else {
                        msg = msg || text || 'Error agregando periodo';
                        // eslint-disable-next-line no-console
                        console.debug('Agregar Periodo error response', { status: res.status, parsed, headerMsg, text });
                      }
                      toast.error(msg || 'Error agregando periodo');
                    }
                  } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('Error agregando periodo', err);
                    toast.error('Error agregando periodo');
                  } finally {
                    if (btn) btn.disabled = false;
                  }
                }}
              >
                <input type='hidden' name='actionType' value='agregar' />
                <div className='grid gap-4 py-4'>
                  {/* ID del Periodo */}
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='idPeriodo' className='text-right'>
                      ID Periodo
                    </Label>
                    <Input
                      id='idPeriodo'
                      name='idPeriodo'
                      type='text'
                      className='col-span-3'
                    />
                  </div>
                  {/* Fecha de Inicio */}
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='fechaInicio' className='text-right'>
                      Fecha de Inicio
                    </Label>
                    <Input
                      id='fechaInicio'
                      name='fechaInicio'
                      type='date'
                      className='col-span-3'
                    />
                  </div>
                  {/* Fecha de Fin */}
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='fechaFin' className='text-right'>
                      Fecha de Fin
                    </Label>
                    <Input
                      id='fechaFin'
                      name='fechaFin'
                      type='date'
                      className='col-span-3'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className='link-button'>Agregar Periodo</Button>
                </DialogFooter>
              </form>
          </DialogContent>
        </Dialog>

        {/* Periodos Data Table */}
        <main className='py-4'>
          {'type' in data && data.type === 'error' && (
            <p>Ocurrió un error cargando los datos</p>
          )}
          {!('type' in data) && (
            <PeriodosDataTable columns={periodosColumns} data={data} />
          )}
        </main>
      </div>
    </>
  );
}
