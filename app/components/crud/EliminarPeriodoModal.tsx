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
  idPeriodo: string;
  nombre?: string;
}

interface EliminarPeriodoModalProps {
  periodo: FormValues;
  open: boolean;
  onClose: () => void;
}

export function EliminarPeriodoModal({
  periodo,
  open,
  onClose,
}: EliminarPeriodoModalProps) {
  const fetcher = useFetcher();
  const [values] = useState<FormValues>(() => ({
    ...periodo,
  }));
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('idPeriodo', values.idPeriodo.toString());
    setIsDeleting(true);
    // submit and wait for fetcher to become idle to react to result
    fetcher.submit(formData, { method: 'post' });
  }

  // React to fetcher responses so we can show toast and close modal
  useEffect(() => {
    // only act when fetcher finished and we are in deleting flow
    if (isDeleting && fetcher.state === 'idle') {
      const data = (fetcher.data as unknown) as { type?: string; message?: string } | undefined;
      if (data && data.type === 'success') {
        toast.success(data.message || 'Periodo eliminado');
        try {
          window.dispatchEvent(new Event('refreshPeriodos'));
        } catch (_) {
          // ignore
        }
        onClose();
      } else if (data && data.type === 'error') {
        toast.error(data.message || 'Error eliminando periodo');
        setIsDeleting(false);
      } else {
        // fallback: if no structured data, try to be helpful
        // fetcher may carry undefined if server redirected; show generic success
        toast.success('Periodo eliminado');
        try {
          window.dispatchEvent(new Event('refreshPeriodos'));
        } catch (_) {}
        onClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data, isDeleting]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Periodo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar el periodo {values.idPeriodo}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='ghost' onClick={onClose}>
            Cancelar
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Sí, eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
