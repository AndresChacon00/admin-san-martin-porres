import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';

interface FormValues {
  id: number;
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
}

export function EliminarEstudianteModal({
  estudiante,
}: EliminarEstudianteModalProps) {
  const fetcher = useFetcher();
  const [values, setValues] = useState<FormValues>(() => ({
    ...estudiante,
  }));

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('id', values.id.toString());
    fetcher.submit(formData, { method: 'post' });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>Eliminar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar estudiante</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar a {values.nombre}{' '}
            {values.apellido}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='ghost'>Cancelar</Button>
          </DialogClose>
          <Button variant='destructive' onClick={handleDelete}>
            Sí, eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
