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
  return [{ title: 'Cursos | San Martín de Porres' }];
};

export async function loader() {
  const data = await getCursos();
  return data;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get('actionType');

  if (actionType === 'agregar') {
    const codigo = formData.get('codigo');
    const nombreCurso = formData.get('nombreCurso');
    const descripcion = formData.get('descripcion');
    const estado = Number(formData.get('estado'));
    const precioTotal = Number(formData.get('precioTotal'));

    if (
      typeof codigo !== 'string' ||
      typeof nombreCurso !== 'string' ||
      typeof descripcion !== 'string' ||
      isNaN(estado) ||
      isNaN(precioTotal)
    ) {
      return json({ error: 'Datos inválidos' }, { status: 400 });
    }

    await addCurso({
      codigo,
      nombreCurso,
      descripcion,
      estado,
      precioTotal,
    });
  }

  if (actionType === 'editar') {
    const codigo = formData.get('codigo');
    const nombreCurso = formData.get('nombreCurso');
    const descripcion = formData.get('descripcion');
    const estado = Number(formData.get('estado'));
    const precioTotal = Number(formData.get('precioTotal'));

    if (
      typeof codigo !== 'string' ||
      typeof nombreCurso !== 'string' ||
      typeof descripcion !== 'string' ||
      isNaN(estado) ||
      isNaN(precioTotal)
    ) {
      return json({ error: 'Datos inválidos' }, { status: 400 });
    }

    await updateCurso(codigo, {
      nombreCurso,
      descripcion,
      estado,
      precioTotal,
    });
  }

  if (actionType === 'eliminar') {
    const codigo = formData.get('codigo');

    if (typeof codigo !== 'string') {
      return json({ error: 'Código inválido' }, { status: 400 });
    }

    await deleteCurso(codigo);
  }

  return redirect('/cursos');
};

export default function CursosPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-xl font-bold">Cursos</h1>
      <div className="py-4 w-3/4">
        <Dialog>
          <DialogTrigger>
            <Button className='link-button'>Agregar Curso</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Curso</DialogTitle>
              <DialogDescription>
                Agrega un nuevo curso a la lista.
              </DialogDescription>
            </DialogHeader>
            <Form method="post">
              <div className="grid gap-4 py-4">
                {/* Código */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="codigo" className="text-right">
                    Código
                  </Label>
                  <Input id="codigo" name="codigo" className="col-span-3" />
                </div>
                {/* Nombre del Curso */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombreCurso" className="text-right">
                    Nombre del Curso
                  </Label>
                  <Input
                    id="nombreCurso"
                    name="nombreCurso"
                    className="col-span-3"
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
                    className="col-span-3"
                  />
                </div>
                {/* Estado */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estado" className="text-right">
                    Estado
                  </Label>
                  <select id="estado" name="estado" className="col-span-3">
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
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
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Agregar Curso</Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
        <main className="py-4 px-4">
          {'type' in data && data.type === 'error' && (
            <p>Ocurrió un error cargando los datos</p>
          )}
          {!('type' in data) && (
            <DataTableCursos
              columns={cursoColumns}
              data={data.map((curso) => ({
                ...curso,
                actions: (
                  <>
                    <EditarCursoModal curso={curso} />
                    <EliminarCursoModal curso={curso} />
                  </>
                ),
              }))}
            />
          )}
        </main>
      </div>
    </>
  );
}