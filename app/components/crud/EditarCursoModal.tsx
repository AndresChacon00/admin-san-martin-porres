import { useState, ChangeEvent, FormEvent } from 'react';
import { useFetcher } from '@remix-run/react';
import { toast } from 'sonner';
import { Curso } from '~/types/cursos.types';
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

interface FormValues {
  nombreCurso: string;
  descripcion: string;
  precioTotal: number;
}

interface EditarCursoModalProps {
  curso: Curso;
  open: boolean;
  onClose: () => void;
}

export function EditarCursoModal({ curso, open, onClose }: EditarCursoModalProps) {
  const cursoSafe = curso as unknown as Partial<Record<string, unknown>>;
  const [values, setValues] = useState<FormValues>(() => ({
    nombreCurso: String(cursoSafe.nombreCurso ?? ''),
    descripcion: String(cursoSafe.descripcion ?? ''),
    precioTotal: Number(cursoSafe.precioTotal ?? 0),
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
      const formData = new FormData();
      formData.append('actionType', 'editar');
      // codigo se envía como hidden desde props (no editable)
      formData.append('codigo', String(cursoSafe.codigo ?? ''));
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
        // notify the page to refresh the loader so the table updates
        try {
          window.dispatchEvent(new Event('refreshCursos'));
        } catch (_) {
          // ignore in non-browser environments
        }
        fetcher.load(window.location.pathname);
        toast.success(data?.message || 'Curso actualizado');
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
      console.error('Error actualizando curso', err);
      toast.error('Ocurrió un error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
          <DialogDescription>Modifica los datos del curso</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="codigo" value={String(cursoSafe.codigo ?? '')} />
          {/* Nombre del Curso */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombreCurso" className="text-right">
              Nombre del Curso
            </Label>
            <Input
              id="nombreCurso"
              name="nombreCurso"
              value={values.nombreCurso}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          {/* Descripción */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descripcion" className="text-right">
              Descripción
            </Label>
            <Input
              id="descripcion"
              name="descripcion"
              value={values.descripcion}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          {/* Precio Total */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="precioTotal" className="text-right">
              Precio Total
            </Label>
            <Input
              id="precioTotal"
              name="precioTotal"
              type="number"
              step="0.01"
              value={values.precioTotal}
              onChange={handleChange}
              className="col-span-3"
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