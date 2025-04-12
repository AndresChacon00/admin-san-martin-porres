import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useFetcher } from '@remix-run/react';
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
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

interface FormValues {
  nombre: string;
  apellido: string;
  cedula: string;
  sexo: string;
  fechaNacimiento: string;
  edad: string;
  religion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ultimoAñoCursado: string;
}

export function AgregarEstudianteModal() {
  const fetcher = useFetcher();
  const [values, setValues] = useState<FormValues>({
    nombre: '',
    apellido: '',
    cedula: '',
    sexo: '',
    fechaNacimiento: '',
    edad: '',
    religion: '',
    telefono: '',
    correo: '',
    direccion: '',
    ultimoAñoCursado: '',
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('actionType', 'agregar');
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fetcher.submit(formData, { method: 'post' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="link-button">Agregar Estudiante</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar estudiante</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo estudiante.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
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

          {/* Cédula */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='cedula' className='text-right'>
              Cédula
            </Label>
            <Input
              id='cedula'
              name='cedula'
              value={values.cedula}
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
              value={values.fechaNacimiento}
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
            <Button type='submit'>Agregar estudiante</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
