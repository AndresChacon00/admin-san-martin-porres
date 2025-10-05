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

interface EliminarEstudianteCursoModalProps {
  idPeriodo: string;
  codigoCurso: string;
  idEstudiante: number;
  nombreEstudiante: string;
  open: boolean;
  onClose: () => void;
}

export function EliminarEstudianteCursoModal({
  idPeriodo,
  codigoCurso,
  idEstudiante,
  nombreEstudiante,
  open,
  onClose,
}: EliminarEstudianteCursoModalProps) {
  const fetcher = useFetcher();

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminarEstudiante');
    formData.append('idPeriodo', idPeriodo.toString());
    formData.append('codigoCurso', codigoCurso);
    formData.append('idEstudiante', idEstudiante.toString());
    fetcher.submit(formData, { method: 'post' });
    onClose(); // Close the modal after submission
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Estudiante del Curso</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar a {nombreEstudiante} del curso{' '}
            {codigoCurso}?
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
