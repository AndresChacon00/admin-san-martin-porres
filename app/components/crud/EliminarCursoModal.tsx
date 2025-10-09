import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FormValues {
  codigo: string;
  nombreCurso: string;
}

interface EliminarCursoModalProps {
  curso: FormValues;
  open: boolean;
  onClose: () => void;
}

export function EliminarCursoModal({ curso, open, onClose }: EliminarCursoModalProps) {
  const fetcher = useFetcher();
  const [values] = useState<FormValues>(() => ({
    ...curso,
  }));
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append('actionType', 'eliminar');
      formData.append('codigo', values.codigo);

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
        onClose();
        toast.success(data?.message || 'Curso eliminado');
      } else {
        const data = (await res.json().catch(() => undefined)) as
          | { message?: string }
          | undefined;
        const text = await res.text().catch(() => '');
        toast.error(data?.message || text || 'Error eliminando curso');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error eliminando curso', err);
      toast.error('Error eliminando curso');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Curso</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar el curso {values.nombreCurso}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}