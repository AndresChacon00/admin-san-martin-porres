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

interface EditarEstudianteModalProps {
  estudiante: FormValues;
  open: boolean;
  onClose: () => void;
}

export function EditarEstudianteModal({
  estudiante,
  open,
  onClose,
}: EditarEstudianteModalProps) {
  const fetcher = useFetcher();
  const [values, setValues] = useState<FormValues>(() => ({
    ...estudiante,
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues((prev) => {
      // Handle fechaNacimiento specifically
      if (name === 'fechaNacimiento') {
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
          <DialogTitle>Editar estudiante</DialogTitle>
          <DialogDescription>
            Modifica los datos del estudiante
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          {/* Cedula (non-editable) */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='cedula' className='text-right'>
              Cédula
            </Label>
            <Input
              id='cedula'
              name='cedula'
              value={values.cedula}
              readOnly
              className='col-span-3'
            />
          </div>
          {/* Nombre */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='nombre' className='text-right'>
              Nombre
            </Label>
            <Input
              id='nombre'
              name='nombre'
              value={values.nombre}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Apellido */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='apellido' className='text-right'>
              Apellido
            </Label>
            <Input
              id='apellido'
              name='apellido'
              value={values.apellido}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>

          {/* Sexo */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='sexo' className='text-right'>
              Sexo
            </Label>
            <Input
              id='sexo'
              name='sexo'
              value={values.sexo}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Fecha de Nacimiento */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='fechaNacimiento' className='text-right'>
              Fecha de Nacimiento
            </Label>
            <Input
              id='fechaNacimiento'
              name='fechaNacimiento'
              type='date'
              value={
                values.fechaNacimiento
                  ? values.fechaNacimiento.toISOString().split('T')[0]
                  : ''
              }
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Edad */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='edad' className='text-right'>
              Edad
            </Label>
            <Input
              id='edad'
              name='edad'
              type='number'
              value={values.edad}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Religión */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='religion' className='text-right'>
              Religión
            </Label>
            <Input
              id='religion'
              name='religion'
              value={values.religion}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Teléfono */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='telefono' className='text-right'>
              Teléfono
            </Label>
            <Input
              id='telefono'
              name='telefono'
              value={values.telefono}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Correo */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='correo' className='text-right'>
              Correo
            </Label>
            <Input
              id='correo'
              name='correo'
              type='email'
              value={values.correo}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Dirección */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='direccion' className='text-right'>
              Dirección
            </Label>
            <Input
              id='direccion'
              name='direccion'
              value={values.direccion}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Último Año Cursado */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='ultimoAñoCursado' className='text-right'>
              Último Año Cursado
            </Label>
            <Input
              id='ultimoAñoCursado'
              name='ultimoAñoCursado'
              value={values.ultimoAñoCursado}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          <DialogFooter>
            <Button type='submit' className='link-button'>Confirmar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
