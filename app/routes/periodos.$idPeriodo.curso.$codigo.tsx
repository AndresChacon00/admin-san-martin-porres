import { useLoaderData, Form, useParams } from '@remix-run/react';
import { obtenerEstudiantesDeCursoPeriodo, inscribirEstudianteCursoPeriodo } from '~/api/controllers/estudiantesCursoPeriodo';
import { DataTable } from '~/components/ui/data-table';
import { estudiantesColumns } from '~/components/columns/estudiantes-columns';
import { estudiantesCursoColumns } from '~/components/columns/estudiantesCurso-columns';
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
import type { LoaderFunction, ActionFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params }) => {
  const idPeriodo = Number(params.idPeriodo);
  const codigoCurso = params.codigo;

  if (isNaN(idPeriodo) || !codigoCurso) {
    throw new Response("Datos inválidos", { status: 400 });
  }

  return await obtenerEstudiantesDeCursoPeriodo(idPeriodo, codigoCurso);
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const idEstudiante = Number(formData.get('idEstudiante'));
  const idPeriodo = Number(params.idPeriodo);
  const codigoCurso = params.codigo;

  if (isNaN(idEstudiante) || isNaN(idPeriodo) || !codigoCurso) {
    return { error: 'Datos inválidos' };
  }

  return await inscribirEstudianteCursoPeriodo({ idPeriodo, codigoCurso, idEstudiante });
};

export default function EstudiantesCursoPage() {
  const estudiantesInscritos = useLoaderData<typeof loader>();
  const { idPeriodo, codigo } = useParams();

  return (
    <>
      <h1 className="text-xl font-bold">Estudiantes en el Curso {codigo} - Periodo {idPeriodo}</h1>
    <div className="py-4 w-3/4">
      <Dialog>
        <DialogTrigger>
          <Button variant="outline">Inscribir Estudiante</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscribir Estudiante</DialogTitle>
            <DialogDescription>
              Ingresa el ID del estudiante que deseas inscribir en este curso.
            </DialogDescription>
          </DialogHeader>
          <Form method="post">
            <Label htmlFor="idEstudiante">ID Estudiante</Label>
            <Input id="idEstudiante" name="idEstudiante" type="number" />
            <DialogFooter>
              <Button type="submit">Inscribir Estudiante</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      <DataTable columns={estudiantesCursoColumns} data={estudiantesInscritos} />
      </div>
    </>
  );
}
