import { useFetcher } from '@remix-run/react';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

interface FormValues {
  idPeriodo: number;
  fechaInicio: Date; // Assuming it's a date in string format
  fechaFin: Date; // Assuming it's a date in string format
}

interface EditarPeriodoModalProps {
  periodo: FormValues;
  open: boolean;
  onClose: () => void;
}

export function EditarPeriodoModal({
  periodo,
  open,
  onClose,
}: EditarPeriodoModalProps) {
  const fetcher = useFetcher();
  const [values, setValues] = useState<FormValues>(() => ({
    ...periodo,
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('actionType', 'editar');
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    fetcher.submit(formData, { method: 'post' });
    onClose(); // Close the modal after submission
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Periodo</DialogTitle>
          <DialogDescription>
            Modifica los datos del periodo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* ID Periodo (non-editable) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="idPeriodo" className="text-right">
              ID Periodo
            </Label>
            <Input
              id="idPeriodo"
              name="idPeriodo"
              value={values.idPeriodo}
              readOnly
              className="col-span-3"
            />
          </div>
          {/* Fecha Inicio */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fechaInicio" className="text-right">
              Fecha de Inicio
            </Label>
            <Input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              value={values.fechaInicio}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          {/* Fecha Fin */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fechaFin" className="text-right">
              Fecha de Fin
            </Label>
            <Input
              id="fechaFin"
              name="fechaFin"
              type="date"
              value={values.fechaFin}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className='link-button'>Confirmar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}