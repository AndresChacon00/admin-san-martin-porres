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
  idPeriodo: number;
  nombre: string;
}

interface EliminarPeriodoModalProps {
  periodo: FormValues;
}

export function EliminarPeriodoModal({ periodo }: EliminarPeriodoModalProps) {
  const fetcher = useFetcher();
  const [values] = useState<FormValues>(() => ({
    ...periodo,
  }));

  function handleDelete() {
    const formData = new FormData();
    formData.append('actionType', 'eliminar');
    formData.append('idPeriodo', values.idPeriodo.toString());
    fetcher.submit(formData, { method: 'post' });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Eliminar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Periodo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar el periodo{values.nombre}?
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