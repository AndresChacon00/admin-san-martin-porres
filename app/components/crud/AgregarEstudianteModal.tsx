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

  const validate = () => {
    const validationErrors: Partial<FormValues> = {};
    if (!values.nombre.trim())
      validationErrors.nombre = 'El nombre es requerido.';
    if (!values.apellido.trim())
      validationErrors.apellido = 'El apellido es requerido.';
    if (!values.cedula.trim())
      validationErrors.cedula = 'La cédula es requerida.';
    if (!values.sexo.trim()) validationErrors.sexo = 'El sexo es requerido.';
    if (!values.fechaNacimiento.trim())
      validationErrors.fechaNacimiento = 'La fecha de nacimiento es requerida.';
    if (!values.edad.trim()) validationErrors.edad = 'La edad es requerida.';
    if (!values.religion.trim())
      validationErrors.religion = 'La religión es requerida.';
    if (!values.telefono.trim())
      validationErrors.telefono = 'El teléfono es requerido.';
    if (!values.correo.trim())
      validationErrors.correo = 'El correo es requerido.';
    if (!values.direccion.trim())
      validationErrors.direccion = 'La dirección es requerida.';
    if (!values.ultimoAñoCursado.trim())
      validationErrors.ultimoAñoCursado = 'El último año cursado es requerido.';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fetcher.submit(formData, { method: 'post' });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='outline'>Agregar Estudiante</Button>
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
            />
            {errors.nombre && (
              <p className='col-span-4 text-red-500 text-sm'>{errors.nombre}</p>
            )}
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
            />
            {errors.apellido && (
              <p className='col-span-4 text-red-500 text-sm'>
                {errors.apellido}
              </p>
            )}
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
            />
            {errors.cedula && (
              <p className='col-span-4 text-red-500 text-sm'>{errors.cedula}</p>
            )}
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
            />
            {errors.sexo && (
              <p className='col-span-4 text-red-500 text-sm'>{errors.sexo}</p>
            )}
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
            />
            {errors.fechaNacimiento && (
              <p className='col-span-4 text-red-500 text-sm'>
                {errors.fechaNacimiento}
              </p>
            )}
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
            />
            {errors.edad && (
              <p className='col-span-4 text-red-500 text-sm'>{errors.edad}</p>
            )}
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
            />
            {errors.religion && (
              <p className='col-span-4 text-red-500 text-sm'>
                {errors.religion}
              </p>
            )}
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
            />
            {errors.telefono && (
              <p className='col-span-4 text-red-500 text-sm'>
                {errors.telefono}
              </p>
            )}
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
            />
            {errors.correo && (
              <p className='col-span-4 text-red-500 text-sm'>{errors.correo}</p>
            )}
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
            />
            {errors.direccion && (
              <p className='col-span-4 text-red-500 text-sm'>
                {errors.direccion}
              </p>
            )}
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
            />
            {errors.ultimoAñoCursado && (
              <p className='col-span-4 text-red-500 text-sm'>
                {errors.ultimoAñoCursado}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type='submit'>Agregar estudiante</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
