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
  codigo: string;
  nombreCurso: string;
  descripcion: string;
  estado: number;
  precioTotal: number;
}

interface EditarCursoModalProps {
  curso: FormValues;
  open: boolean;
  onClose: () => void;
}

export function EditarCursoModal({ curso, open, onClose }: EditarCursoModalProps) {
  const fetcher = useFetcher();
  const [values, setValues] = useState<FormValues>(() => ({
    ...curso,
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
          <DialogTitle>Editar Curso</DialogTitle>
          <DialogDescription>Modifica los datos del curso</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Código (non-editable) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codigo" className="text-right">
              Código
            </Label>
            <Input
              id="codigo"
              name="codigo"
              value={values.codigo}
              readOnly
              className="col-span-3"
            />
          </div>
          {/* Nombre del Curso */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombreCurso" className="text-right">
              Nombre del Curso
            </Label>
            <Input
              id="nombreCurso"
              name="nombreCurso"
              value={values.nombreCurso}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          {/* Descripción */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descripcion" className="text-right">
              Descripción
            </Label>
            <Input
              id="descripcion"
              name="descripcion"
              value={values.descripcion}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          {/* Estado */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estado" className="text-right">
              Estado
            </Label>
            <Input
              id="estado"
              name="estado"
              type="number"
              value={values.estado}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          {/* Precio Total */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="precioTotal" className="text-right">
              Precio Total
            </Label>
            <Input
              id="precioTotal"
              name="precioTotal"
              type="number"
              step="0.01"
              value={values.precioTotal}
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