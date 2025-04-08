import { useLoaderData, Form, useParams } from '@remix-run/react';
import { obtenerCursosPorPeriodo, inscribirCursoEnPeriodo } from '~/api/controllers/cursosPeriodo';
import { cursoColumnsWithActions } from '~/components/columns/cursosPeriodos-columns';
import { DataTable } from '~/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { ActionFunction, LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params }) => {
  const idPeriodo = Number(params.idPeriodo);
  if (isNaN(idPeriodo)) {
    return { type: 'error', message: 'ID de periodo inválido' };
  }
  return await obtenerCursosPorPeriodo(idPeriodo);
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const idCurso = Number(formData.get('idCurso'));
  const idPeriodo = Number(params.idPeriodo);
  const horario = String(formData.get('horario'));

  if (isNaN(idCurso) || isNaN(idPeriodo) || !horario) {
    return { error: 'Datos inválidos' };
  }

  return await inscribirCursoEnPeriodo( idPeriodo, idCurso, horario );
};

export default function CursosPeriodoPage() {
  const cursosInscritos = useLoaderData<typeof loader>();
  const { idPeriodo } = useParams();

  return (
    <>
      <h1 className="text-xl font-bold">Cursos en el Periodo {idPeriodo}</h1>

      {/* Botón para abrir el diálogo de inscripción */}
      <div className="py-4 w-3/4">
      <Dialog>
        <DialogTrigger>
          <Button className="link-button">Inscribir Curso</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscribir Curso</DialogTitle>
            <DialogDescription>
              Selecciona el curso que deseas agregar a este periodo.
            </DialogDescription>
          </DialogHeader>
          <Form method="post">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="idCurso" className="text-right">
                  ID Curso
                </Label>
                <Input id="idCurso" name="idCurso" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="horario" className="text-right">
                  Horario
                </Label>
                <Input id="horario" name="horario" type="text" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Inscribir Curso</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Tabla de cursos inscritos en este periodo */}
      <main className="py-4">
        {'type' in cursosInscritos && cursosInscritos.type === 'error' ? (
          <p>Ocurrió un error cargando los cursos</p>
        ) : (
          <DataTable columns={cursoColumnsWithActions(Number(idPeriodo))} data={cursosInscritos} />
        )}
      </main>
      </div>
    </>
  );
}
