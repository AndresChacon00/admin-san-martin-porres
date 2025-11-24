import React, { useEffect, useState } from 'react';
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

export function NotasCursoDialog({
  idPeriodo,
  codigoCurso,
  initialNotas,
}: {
  idPeriodo: string;
  codigoCurso: string;
  initialNotas?: NotaRow[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notas, setNotas] = useState<NotaRow[]>([]);
  const fetcher = useFetcher();

  useEffect(() => {
    if (!open) return;
    // If initialNotas provided from loader, use them; otherwise trigger loader via fetcher
    if (initialNotas && Array.isArray(initialNotas)) {
      setNotas(initialNotas as NotaRow[]);
      return;
    }
    fetcher.load(window.location.pathname);
  }, [open, initialNotas, fetcher]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as any;
      const list = Array.isArray(data) ? data : (data?.notas ?? []);
      setNotas(list);
    }
  }, [fetcher.state, fetcher.data]);

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
    setLoading(true);
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
      fetcher.submit(form, { method: 'post' });
    } catch (err) {
      console.error('Error preparing notas payload:', err);
      toast.error('Error al preparar las notas');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const data = fetcher.data as any;
      if (data?.type === 'success') {
        toast.success('Notas guardadas');
        setOpen(false);
      } else if (data?.type === 'error') {
        toast.error(data.message || 'Error guardando notas');
      }
      setLoading(false);
    }
  }, [fetcher.state, fetcher.data]);

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
