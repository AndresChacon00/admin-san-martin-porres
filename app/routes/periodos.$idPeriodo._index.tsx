import { useLoaderData, Form, useParams, MetaFunction } from '@remix-run/react';
import { obtenerCursosPorPeriodo, inscribirCursoEnPeriodo , eliminarCursoDePeriodo } from '~/api/controllers/cursosPeriodo';
import { cursoColumns } from '~/components/columns/cursos-columns';
import { cursoColumnsWithActions } from '~/components/columns/cursosPeriodos-columns';
import { DataTable } from '~/components/ui/data-table';
import { CursosPeriodosDataTable } from '~/components/data-tables/cursosPeriodo-data-table'; // Import the custom data table
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
  const idPeriodo = String(params.idPeriodo);
  if (!idPeriodo) {
    return { type: 'error', message: 'ID de periodo inválido' };
  }
  return await obtenerCursosPorPeriodo(idPeriodo);
}


export const meta: MetaFunction = () => {
  return [{ title: 'Periodos | San Martín de Porres' }];
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get('actionType');
  const idPeriodo = String(params.idPeriodo);

  if (!idPeriodo) {
    return { error: 'ID de periodo inválido' };
  }

  if (actionType === 'inscribirCurso') {
    const idCurso = Number(formData.get('idCurso'));
    const horario = String(formData.get('horario'));

    if (isNaN(idCurso) || !horario) {
      return { error: 'Datos inválidos' };
    }

    return await inscribirCursoEnPeriodo(idPeriodo, idCurso, horario);
  }

  if (actionType === 'eliminarCursoPeriodo') {
    const codigoCurso = formData.get('codigoCurso');

    if (!codigoCurso) {
      return { error: 'Código del curso inválido' };
    }

    return await eliminarCursoDePeriodo(idPeriodo, Number(codigoCurso));
  }

  return { error: 'Acción no válida' };
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
            <input type="hidden" name="actionType" value="inscribirCurso" />
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
          <CursosPeriodosDataTable
              columns={cursoColumns} // Pass the base columns
              data={cursosInscritos} // Pass the data from the loader
              idPeriodo={String(idPeriodo)} // Pass the period ID as string
            />
        )}
      </main>
      </div>
    </>
  );
}
