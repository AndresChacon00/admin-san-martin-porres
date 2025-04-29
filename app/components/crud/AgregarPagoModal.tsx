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
  monto: number;
  fecha: string;
  tipoPago: string;
  comprobante: string;
}

interface AgregarPagoModalProps {
  idPeriodo: number;
  codigoCurso: string;
  idEstudiante: number;
  open: boolean;
  onClose: () => void;
}

export function AgregarPagoModal({
  idPeriodo,
  codigoCurso,
  idEstudiante,
  open,
  onClose,
}: AgregarPagoModalProps) {
  const fetcher = useFetcher();
  const [values, setValues] = useState<FormValues>({
    monto: 0,
    fecha: '',
    tipoPago: '',
    comprobante: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('actionType', 'agregar');
    formData.append('idPeriodo', idPeriodo.toString());
    formData.append('codigoCurso', codigoCurso);
    formData.append('idEstudiante', idEstudiante.toString());
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
          <DialogTitle>Agregar Pago</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo pago para el estudiante con ID {idEstudiante}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Indicadores */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="idPeriodo" className="text-right">
              ID Periodo
            </Label>
            <Input
              id="idPeriodo"
              name="idPeriodo"
              value={idPeriodo}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codigoCurso" className="text-right">
              Código Curso
            </Label>
            <Input
              id="codigoCurso"
              name="codigoCurso"
              value={codigoCurso}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="idEstudiante" className="text-right">
              ID Estudiante
            </Label>
            <Input
              id="idEstudiante"
              name="idEstudiante"
              value={idEstudiante}
              readOnly
              className="col-span-3"
            />
          </div>
          {/* Campos Editables */}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fecha" className="text-right">
              Fecha
            </Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              value={values.fecha}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipoPago" className="text-right">
              Tipo de Pago
            </Label>
            <Input
              id="tipoPago"
              name="tipoPago"
              value={values.tipoPago}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comprobante" className="text-right">
              Comprobante
            </Label>
            <Input
              id="comprobante"
              name="comprobante"
              value={values.comprobante}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Agregar Pago</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}