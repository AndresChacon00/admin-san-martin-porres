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
  codigo: string;
  nombreCurso: string;
}

interface EliminarCursoModalProps {
  curso: FormValues;
}

export function EliminarCursoModal({ curso }: EliminarCursoModalProps) {
  const fetcher = useFetcher();
  const [values] = useState<FormValues>(() => ({
    ...curso,
  }));

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('codigo', values.codigo);
    fetcher.submit(formData, { method: 'post' });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Eliminar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Curso</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar el curso {values.nombreCurso}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Sí, eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}