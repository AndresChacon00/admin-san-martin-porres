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

interface EliminarPagoModalProps {
  idPago: number;
  open: boolean;
  onClose: () => void;
}

export function EliminarPagoModal({
  idPago,
  open,
  onClose,
}: EliminarPagoModalProps) {
  const fetcher = useFetcher();

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('idPago', idPago.toString());
    fetcher.submit(formData, { method: 'post' });
    onClose(); // Close the modal after submission
  }

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
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Sí, eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}