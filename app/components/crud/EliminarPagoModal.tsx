import { useEffect, useState } from 'react';
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

interface EliminarPagoModalProps {
  idPago: number;
  open: boolean;
  onClose: () => void;
}

export function EliminarPagoModal({ idPago, open, onClose }: EliminarPagoModalProps) {
  const fetcher = useFetcher();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('idPago', idPago.toString());
    setIsDeleting(true);
    fetcher.submit(formData, { method: 'post' });
  };

  useEffect(() => {
    if (isDeleting && fetcher.state === 'idle') {
      const data = fetcher.data as { type?: string; message?: string; error?: string } | undefined;
      if (data?.type === 'success') {
        toast.success(data.message || 'Pago eliminado');
        try {
          window.dispatchEvent(new Event('refreshPagos'));
        } catch (_) {
          // ignore
        }
        try {
          fetcher.load(window.location.pathname);
        } catch (_) {
          // ignore
        }
        onClose();
      } else if (data?.error || data?.type === 'error') {
        toast.error(data.error || data.message || 'Error eliminando pago');
        setIsDeleting(false);
      } else {
        // fallback: assume success if server redirected without data
        toast.success('Pago eliminado');
        try {
          window.dispatchEvent(new Event('refreshPagos'));
        } catch (_) {}
        try {
          fetcher.load(window.location.pathname);
        } catch (_) {}
        onClose();
      }
    }
  }, [fetcher, fetcher.data, fetcher.state, isDeleting, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Pago</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar el pago con ID {idPago}?
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