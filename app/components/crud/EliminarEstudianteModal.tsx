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

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('cedula', values.cedula.toString());
    fetcher.submit(formData, { method: 'post' });
    onClose(); // Close the modal after submission
  }

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
