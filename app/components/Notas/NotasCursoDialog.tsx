import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { toast } from 'sonner';
import { useFetcher } from '@remix-run/react';

interface NotaRow {
  cedula: string;
  nombre: string;
  apellido: string;
  notaCuantitativa?: number | null;
  notaCualitativa?: string | null;
}

interface GuardarNotasResponse {
  type?: 'success' | 'error';
  message?: string;
}

function isNotasContainer(value: unknown): value is { notas?: NotaRow[] } {
  return !!value && typeof value === 'object' && 'notas' in value;
}

export function NotasCursoDialog({
  initialNotas,
}: {
  idPeriodo: string;
  codigoCurso: string;
  initialNotas?: NotaRow[];
}) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notas, setNotas] = useState<NotaRow[]>([]);
  const notasFetcher = useFetcher();
  const saveFetcher = useFetcher();
  const loading = isSaving && saveFetcher.state !== 'idle';

  useEffect(() => {
    if (!open) return;
    // If initialNotas provided from loader, use them; otherwise trigger loader via fetcher
    if (initialNotas && Array.isArray(initialNotas)) {
      setNotas(initialNotas as NotaRow[]);
      return;
    }
    notasFetcher.load(window.location.pathname);
  }, [open, initialNotas, notasFetcher]);

  useEffect(() => {
    if (notasFetcher.state === 'idle' && notasFetcher.data) {
      const data = notasFetcher.data as unknown;
      const list = Array.isArray(data)
        ? data
        : isNotasContainer(data)
          ? (data.notas ?? [])
          : [];
      setNotas(list);
    }
  }, [notasFetcher.state, notasFetcher.data]);

  const handleChange = (
    cedula: string,
    field: 'notaCuantitativa' | 'notaCualitativa',
    value: string,
  ) => {
    setNotas((prev) =>
      prev.map((r) =>
        r.cedula === cedula
          ? {
              ...r,
              [field]:
                field === 'notaCuantitativa'
                  ? value === ''
                    ? null
                    : Number(value)
                  : value,
            }
          : r,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        notas: notas.map((n) => ({
          cedula: n.cedula,
          notaCuantitativa: n.notaCuantitativa ?? null,
          notaCualitativa: n.notaCualitativa ?? null,
        })),
      };
      const form = new FormData();
      form.append('actionType', 'guardarNotas');
      form.append('notas', JSON.stringify(payload.notas));
      saveFetcher.submit(form, { method: 'post' });
    } catch (err) {
      console.error('Error preparing notas payload:', err);
      toast.error('Error al preparar las notas');
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isSaving || saveFetcher.state !== 'idle') return;

    const data = saveFetcher.data as GuardarNotasResponse | undefined;
    if (data?.type === 'error') {
      toast.error(data.message || 'Error guardando notas');
      setIsSaving(false);
      return;
    }

    toast.success('Notas guardadas');
    setOpen(false);
    setIsSaving(false);
  }, [isSaving, saveFetcher.state, saveFetcher.data]);

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button className='link-button'>Notas Estudiantes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notas por curso</DialogTitle>
          <DialogDescription>
            Visualiza y edita las notas cuantitativas y cualitativas de los
            estudiantes.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <div className='overflow-auto'>
              <table className='w-full table-auto border-collapse'>
                <thead>
                  <tr>
                    <th className='text-left p-2'>Cédula</th>
                    <th className='text-left p-2'>Nombre</th>
                    <th className='text-left p-2'>Nota Cuantitativa</th>
                    <th className='text-left p-2'>Nota Cualitativa</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((r) => (
                    <tr key={r.cedula} className='border-t'>
                      <td className='p-2'>{r.cedula}</td>
                      <td className='p-2'>
                        {r.nombre} {r.apellido}
                      </td>
                      <td className='p-2'>
                        <input
                          type='number'
                          min='0'
                          max='100'
                          step='0.01'
                          value={
                            r.notaCuantitativa == null
                              ? ''
                              : String(r.notaCuantitativa)
                          }
                          onChange={(e) =>
                            handleChange(
                              r.cedula,
                              'notaCuantitativa',
                              e.target.value,
                            )
                          }
                          className='border rounded px-2 py-1 w-24'
                        />
                      </td>
                      <td className='p-2'>
                        <input
                          type='text'
                          value={r.notaCualitativa ?? ''}
                          onChange={(e) =>
                            handleChange(
                              r.cedula,
                              'notaCualitativa',
                              e.target.value,
                            )
                          }
                          className='border rounded px-2 py-1 w-full'
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            Guardar notas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NotasCursoDialog;
