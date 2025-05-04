// Esta pagina deberia ser borrada
import {
  useLoaderData,
  MetaFunction,
  Form,
  redirect,
  useActionData,
} from '@remix-run/react';
import {
  addCurso,
  deleteCurso,
  getCursos,
  updateCurso,
} from '~/api/controllers/cursos';
import { cursoColumns } from '~/components/columns/cursos-columns';
import { DataTableCursos } from '~/components/data-tables/cursos-data-table';
import { EditarCursoModal } from '~/components/crud/EditarCursoModal';
import { EliminarCursoModal } from '~/components/crud/EliminarCursoModal';
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
import { ActionFunction, json, LoaderFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Cursos detalle | San Martín de Porres' }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const codigoCurso = params.codigo;

  return codigoCurso;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // Obtener los valores del formulario
  const nombreCentro = formData.get('nombreCentro');
  const coordinadorGeneral = formData.get('coordinadorGeneral');

  // Imprimir los datos en la consola del servidor
  console.log('Nombre del Centro:', nombreCentro);
  console.log('Coordinador General:', coordinadorGeneral);

  // Puedes realizar otras acciones aquí, como guardar en la base de datos

  return json({ success: true });
};

export default function CursosDetallePage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Cursos detalleee</h1>
      <Dialog>
        <DialogTrigger>
          <Button className=''>Generar relacion participantes</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Relación Participantes</DialogTitle>
            <DialogDescription>Ingrese los datos solicitados</DialogDescription>
          </DialogHeader>
          <Form method='post'>
            {/* Nombre del centro */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='codigo' className='text-right'>
                Nombre del Centro
              </Label>
              <Input
                id='nombreCentro'
                name='nombreCentro'
                className='col-span-3'
              />
            </div>
            {/* Coordinador General */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='codigo' className='text-right'>
                Coordinador general
              </Label>
              <Input
                id='coordinadorGeneral'
                name='coordinadorGeneral'
                className='col-span-3'
              />
            </div>
            <DialogFooter>
              <Button type='submit'>Generar relacion participantes</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
