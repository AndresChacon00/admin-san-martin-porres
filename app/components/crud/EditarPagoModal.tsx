import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useFetcher } from '@remix-run/react';
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
  idPago: number;
  idPeriodo: number;
  codigoCurso: string;
  idEstudiante: number;
  monto: number;
  fecha: string;
  tipoPago: string;
  comprobante: string;
}

interface EditarPagoModalProps {
  pago: FormValues;
  open: boolean;
  onClose: () => void;
}

export function EditarPagoModal({
  pago,
  open,
  onClose,
}: EditarPagoModalProps) {
  const fetcher = useFetcher();
  const [values, setValues] = useState<FormValues>(() => ({
    ...pago,
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
          <DialogTitle>Editar Pago</DialogTitle>
          <DialogDescription>
            Modifica los datos del pago.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Campos */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="idPago" className="text-right">
              ID Pago
            </Label>
            <Input
              id="idPago"
              name="idPago"
              value={values.idPago}
              readOnly
              className="col-span-3"
            />
          </div>
          {/* Otros campos */}
          {/* Similar to AgregarPagoModal */}
          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}