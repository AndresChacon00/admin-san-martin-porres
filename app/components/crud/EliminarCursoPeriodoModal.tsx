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

interface EliminarCursoPeriodoModalProps {
  idPeriodo: string;
  codigoCurso: string;
  open: boolean;
  onClose: () => void;
}

export function EliminarCursoPeriodoModal({
  idPeriodo,
  codigoCurso,
  open,
  onClose,
}: EliminarCursoPeriodoModalProps) {
  const fetcher = useFetcher();

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminarCursoPeriodo');
    formData.append('idPeriodo', idPeriodo.toString());
    formData.append('codigoCurso', codigoCurso);
    fetcher.submit(formData, { method: 'post' });
    onClose(); // Close the modal after submission
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Curso del Periodo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar el curso {codigoCurso} del periodo{' '}
            {idPeriodo}?
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
