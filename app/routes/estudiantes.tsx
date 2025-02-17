import { useLoaderData, MetaFunction, Form } from '@remix-run/react';
import {
  addEstudiante,
  getEstudiantes,
} from '~/api/controllers/estudiantes.server';
import { estudiantesColumns } from '~/components/columns/estudiantes-columns';
import { DialogDemo } from '~/components/Dialog';
import { DataTable } from '~/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { ActionFunction } from '@remix-run/node';
export const meta: MetaFunction = () => {
  return [{ title: 'Estudiantes | San Matín de Porres' }];
};

export async function loader() {
  const data = await getEstudiantes();
  return data;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const nombre = formData.get('nombre');
  const apellido = formData.get('apellido');
  const cedula = formData.get('cedula');
  const sexo = formData.get('sexo');
  const fechaNacimiento = formData.get('fechaNacimiento');
  const edad = formData.get('edad');
  const religion = formData.get('religion');
  const telefono = formData.get('telefono');
  const correo = formData.get('correo');
  const direccion = formData.get('direccion');
  const ultimoAñoCursado = formData.get('ultimoAñoCursado');

  // Aquí puedes agregar validaciones de los datos

  if (
    typeof nombre !== 'string' ||
    typeof apellido !== 'string' ||
    typeof cedula !== 'string' ||
    typeof sexo !== 'string' ||
    typeof fechaNacimiento !== 'string' ||
    typeof edad !== 'string' ||
    typeof religion !== 'string' ||
    typeof telefono !== 'string' ||
    typeof correo !== 'string' ||
    typeof direccion !== 'string' ||
    typeof ultimoAñoCursado !== 'string'
  ) {
    return { error: 'Datos inválidos' };
  }

  await addEstudiante({
    nombre,
    apellido,
    cedula,
    sexo,
    fechaNacimiento: new Date(fechaNacimiento),
    edad: Number(edad),
    religion,
    telefono,
    correo,
    direccion,
    ultimoAñoCursado,
  });
  return null;
};

export default function EstudiantesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Estudiantes</h1>
      <Dialog>
        <DialogTrigger>
          <Button variant='outline'>Add Student</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar estudiante</DialogTitle>
            <DialogDescription>
              Agrega los datos de un nuevo estudiante acá.
            </DialogDescription>
          </DialogHeader>
          {/* Usamos <Form> de Remix, pero es un elemento form normal */}
          <Form method='post'>
            <div className='grid gap-4 py-4'>
              {/* Nombre */}
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='nombre' className='text-right'>
                  Nombre
                </Label>
                <Input
                  id='nombre'
                  name='nombre'
                  defaultValue='Pedro'
                  className='col-span-3'
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
                  defaultValue='Pérez'
                  className='col-span-3'
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
                  defaultValue='123456789'
                  className='col-span-3'
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
                  defaultValue='Masculino'
                  className='col-span-3'
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
                  className='col-span-3'
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
                  defaultValue='18'
                  className='col-span-3'
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
                  defaultValue='Católica'
                  className='col-span-3'
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
                  defaultValue='555-1234'
                  className='col-span-3'
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
                  defaultValue='estudiante@correo.com'
                  className='col-span-3'
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
                  defaultValue='Calle Falsa 123'
                  className='col-span-3'
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
                  defaultValue='12'
                  className='col-span-3'
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Agregar estudiante</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
      <main className='py-4'>
        {'type' in data && data.type === 'error' && (
          <p>Ocurrió un error cargando los datos</p>
        )}
        {!('type' in data) && (
          <DataTable columns={estudiantesColumns} data={data} />
        )}
      </main>
    </>
  );
}
