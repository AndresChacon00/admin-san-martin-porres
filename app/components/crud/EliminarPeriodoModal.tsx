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

interface FormValues {
  idPeriodo: string;
  nombre: string;
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

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('idPeriodo', values.idPeriodo.toString());
    fetcher.submit(formData, { method: 'post' });
    onClose(); // Close the modal after submission
  }

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
