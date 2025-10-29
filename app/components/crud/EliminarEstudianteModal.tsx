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
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface FormValues {
  nombre: string;
  apellido: string;
  cedula: string;
  sexo: string;
  fechaNacimiento: Date | null;
  edad: number;
  religion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ultimoAñoCursado: string;
}

interface EliminarEstudianteModalProps {
  estudiante: FormValues;
  open: boolean;
  onClose: () => void;
}

export function EliminarEstudianteModal({
  estudiante,
  open,
  onClose,
}: EliminarEstudianteModalProps) {
  const fetcher = useFetcher();
  const [values] = useState<FormValues>(() => ({
    ...estudiante,
  }));
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append('actionType', 'eliminar');
      formData.append('cedula', values.cedula.toString());

      const res = await fetch(window.location.pathname, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      // If the HTTP response indicates success (including redirects that were
      // followed), treat it as a successful delete. This handles cases where
      // the server returns HTML or redirects instead of JSON.
      if (res.status < 400) {
        // try to read message if any
        let data: { type?: string; message?: string } | undefined;
        try {
          data = await res.json().catch(() => undefined);
        } catch (_) {
          data = undefined;
        }
        // notify page to refresh loader and update list
        try {
          window.dispatchEvent(new Event('refreshEstudiantes'));
        } catch (_) {
          // ignore in non-browser environments
        }
        fetcher.load(window.location.pathname);
        onClose();
        toast.success(data?.message || 'Estudiante eliminado');
        // Fallback: some environments/components may not react to revalidation
        // immediately. Force a reload shortly after to guarantee the table is updated.
        try {
          setTimeout(() => {
            try {
              fetcher.load(window.location.pathname);
            } catch (_) {
              // ignore
            }
            // final fallback: full reload
            try {
              window.location.reload();
            } catch (_) {
              // ignore in non-browser environments
            }
          }, 350);
        } catch (_) {
          // ignore
        }
      } else {
        // Non-success HTTP status: try to parse error message
        let data: { type?: string; message?: string } | undefined;
        try {
          data = await res.json().catch(() => undefined);
        } catch (_) {
          data = undefined;
        }
        const text = await res.text().catch(() => '');
        toast.error(data?.message || text || 'Error eliminando estudiante');
      }
    } catch (err) {
      // network or unexpected error
      // eslint-disable-next-line no-console
      console.error('Error eliminando estudiante', err);
      toast.error('Error eliminando estudiante');
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    const maybeData = (fetcher as unknown as { data?: unknown }).data;
    if (fetcher.state === 'idle' && maybeData) {
      const d = maybeData as { type?: string; message?: string } | undefined;
      if (d?.type === 'success' || d?.type === 'succes') {
        // reload current route to refresh table data
        fetcher.load(window.location.pathname);
        onClose();
      }
      if (d?.type === 'error') {
        // keep modal open and show error toast
        // eslint-disable-next-line no-console
        console.error('Error al eliminar estudiante:', d.message);
        onClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, (fetcher as unknown as { data?: unknown }).data]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar estudiante</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar a {values.nombre}{' '}
            {values.apellido}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='ghost' onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
