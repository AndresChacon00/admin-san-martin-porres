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

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('codigo', values.codigo);
    fetcher.submit(formData, { method: 'post' });
    onClose(); // Close the modal after submission
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