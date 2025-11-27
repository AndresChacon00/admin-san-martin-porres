import { useState, ChangeEvent, FormEvent } from 'react';
import { useFetcher } from '@remix-run/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Periodo } from '~/types/periodos.types';

// Use string dates for form inputs
interface FormValues {
  idPeriodo: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
}

interface EditarPeriodoModalProps {
  periodo: Periodo;
  open: boolean;
  onClose: () => void;
}

export function EditarPeriodoModal({
  periodo,
  open,
  onClose,
}: EditarPeriodoModalProps) {
  // using direct fetch for AJAX

  // Helper to normalize a date-like value to 'YYYY-MM-DD' string
  const toDateString = (d: unknown) => {
    if (!d) return '';
    try {
      const s = typeof d === 'string' || typeof d === 'number' ? String(d) : (d instanceof Date ? d.toISOString() : String(d));
      const dt = new Date(s);
      if (isNaN(dt.getTime())) return '';
      return dt.toISOString().slice(0, 10);
    } catch {
      return '';
    }
  };

  const [values, setValues] = useState<FormValues>(() => ({
    idPeriodo: String(periodo?.idPeriodo ?? ''),
  fechaInicio: toDateString((periodo as unknown as { fechaInicio?: unknown })?.fechaInicio),
  fechaFin: toDateString((periodo as unknown as { fechaFin?: unknown })?.fechaFin),
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const fetcher = useFetcher();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Client-side validation: ensure fechaFin >= fechaInicio
      const fi = values.fechaInicio;
      const ff = values.fechaFin;
      if (typeof fi === 'string' && typeof ff === 'string') {
        const d1 = new Date(fi);
        const d2 = new Date(ff);
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
          toast.error('Fechas inválidas');
          setIsSaving(false);
          return;
        }
        if (d2 < d1) {
          toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
          setIsSaving(false);
          return;
        }
      }
      const formData = new FormData();
      formData.append('actionType', 'editar');
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const res = await fetch(window.location.pathname, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (res.status < 400) {
        const data = (await res.json().catch(() => undefined)) as
          | { message?: string }
          | undefined;
        try {
          window.dispatchEvent(new Event('refreshPeriodos'));
        } catch (_) {
          // ignore in non-browser environments
        }
        fetcher.load(window.location.pathname);
        toast.success(data?.message || 'Periodo actualizado');
        onClose();
      } else {
        const data = (await res.json().catch(() => undefined)) as
          | { message?: string }
          | undefined;
        const text = await res.text().catch(() => '');
        toast.error(data?.message || text || 'Ocurrió un error');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error actualizando periodo', err);
      toast.error('Ocurrió un error');
    } finally {
      setIsSaving(false);
    }
  };

  // legacy fetcher-based effect removed; using direct fetch in handleSubmit

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Periodo</DialogTitle>
          <DialogDescription>Modifica los datos del periodo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          {/* ID Periodo (non-editable) */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='idPeriodo' className='text-right'>
              ID Periodo
            </Label>
            <Input
              id='idPeriodo'
              name='idPeriodo'
              value={values.idPeriodo}
              readOnly
              className='col-span-3'
            />
          </div>

          {/* Fecha Inicio */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='fechaInicio' className='text-right'>
              Fecha de Inicio
            </Label>
            <Input
              id='fechaInicio'
              name='fechaInicio'
              type='date'
              value={values.fechaInicio}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Fecha Fin */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='fechaFin' className='text-right'>
              Fecha de Fin
            </Label>
            <Input
              id='fechaFin'
              name='fechaFin'
              type='date'
              value={values.fechaFin}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className='link-button' disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Confirmar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
