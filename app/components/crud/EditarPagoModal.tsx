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

import { PagoEstudianteUpdate } from '~/types/pagosEstudiantesCurso.types';



interface EditarPagoModalProps {
  pago: PagoEstudianteUpdate;
  open: boolean;
  onClose: () => void;
}

export function EditarPagoModal({
  pago,
  open,
  onClose,
}: EditarPagoModalProps) {
  const fetcher = useFetcher();
  const [values, setValues] = useState<PagoEstudianteUpdate>(() => ({
    ...pago,
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setValues((prev) => {
      if (name === 'fecha') {
        const parsedDate = new Date(value);
        if (isNaN(parsedDate.getTime())) {
          console.error('Invalid date format:', value);
          return prev; // Do not update if the date is invalid
        }
        return { ...prev, [name]: parsedDate };
      }

      return { ...prev, [name]: value };
    });
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
          {/* ID Pago (non-editable) */}
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

          {/* Monto */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="monto" className="text-right">
              Monto
            </Label>
            <Input
              id="monto"
              name="monto"
              type="number"
              value={values.monto}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>

          {/* Fecha */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fecha" className="text-right">
              Fecha
            </Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              value={values.fecha ? values.fecha.toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>

          {/* Tipo de Pago */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipoPago" className="text-right">
              Tipo de Pago
            </Label>
            <select
              id="tipoPago"
              name="tipoPago"
              value={values.tipoPago}
              onChange={handleChange}
              className="col-span-3 border rounded px-2 py-1"
              required
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          {/* Comprobante */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comprobante" className="text-right">
              Comprobante
            </Label>
            <Input
              id="comprobante"
              name="comprobante"
              value={values.comprobante? values.comprobante : ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}