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
import { ActionFunction, json } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Cursos detalle | San Martín de Porres' }];
};

export async function loader() {
  const data = await getCursos();
  return data;
}

export default function CursosPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className='text-xl font-bold'>Cursos detalleee</h1>
    </>
  );
}
