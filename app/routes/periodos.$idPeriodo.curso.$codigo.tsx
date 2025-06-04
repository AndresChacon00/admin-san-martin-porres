import { useLoaderData, Form, useParams } from '@remix-run/react';
import {
  obtenerEstudiantesDeCursoPeriodo,
  inscribirEstudianteCursoPeriodo,
} from '~/api/controllers/estudiantesCursoPeriodo';
import { calcularDeuda } from '~/api/controllers/pagosEstudiantesCursos';
import { DataTable } from '~/components/ui/data-table';
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
import { GenerarRelacionParticipantesDialog } from '~/components/Planillas/GenerarRelacionParticipantesDialog';
import { number } from 'zod';

export const loader: LoaderFunction = async ({ params }) => {
  const idPeriodo = Number(params.idPeriodo);
  const codigoCurso = params.codigo;

  if (isNaN(idPeriodo) || !codigoCurso) {
    throw new Response('Datos inválidos', { status: 400 });
  }

  const estudiantes = await obtenerEstudiantesDeCursoPeriodo(
    idPeriodo,
    codigoCurso,
  );

  // Calcular la deuda para cada estudiante
  if (!Array.isArray(estudiantes)) {
    throw new Response(estudiantes.message || 'Error al obtener estudiantes', {
      status: 500,
    });
  }

  const estudiantesConDeuda = await Promise.all(
    estudiantes.map(async (estudiante) => {
      if (!estudiante.cedula) {
        console.error('El estudiante no tiene un ID válido:', estudiante);
        return { ...estudiante, deuda: 0 };
      }

      const deudaResult = await calcularDeuda({
        idPeriodo,
        codigoCurso,
        cedulaEstudiante: estudiante.cedula,
      });

      const deuda = deudaResult.type === 'success' ? deudaResult.deuda : 0;

      return {
        ...estudiante,
        deuda,
      };
    }),
  );

  return estudiantesConDeuda;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const cedulaEstudiante = formData.get('cedulaEstudiante') as string | null;

  const idPeriodo = Number(params.idPeriodo);
  const codigoCurso = params.codigo;

  if (!cedulaEstudiante || isNaN(idPeriodo) || !codigoCurso) {
    return { error: 'Datos inválidos' };
  }

  return await inscribirEstudianteCursoPeriodo({
    idPeriodo,
    codigoCurso,
    cedulaEstudiante,
  });
};

export default function EstudiantesCursoPage() {
  const estudiantesInscritos = useLoaderData<typeof loader>();
  const { idPeriodo, codigo } = useParams();
  console.log('Estudiantes inscritos:', estudiantesInscritos);
  return (
    <>
      <h1 className='text-xl font-bold'>
        Estudiantes en el Curso {codigo} - Periodo {idPeriodo}
      </h1>
      <div className='py-4 w-3/4'>
        <Dialog>
          <DialogTrigger>
            <Button className='link-button'>Inscribir Estudiante</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inscribir Estudiante</DialogTitle>
              <DialogDescription>
                Ingresa la cédula del estudiante que deseas inscribir en este
                curso.
              </DialogDescription>
            </DialogHeader>
            <Form method='post'>
              <Label htmlFor='cedulaEstudiante'>Cedula Estudiante</Label>
              <Input
                id='cedulaEstudiante'
                name='cedulaEstudiante'
                type='number'
              />
              <DialogFooter>
                <Button type='submit'>Inscribir Estudiante</Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Dialog generacion de plantilla */}
        <GenerarRelacionParticipantesDialog
          idPeriodo={Number(idPeriodo)}
          codigoCurso={codigo || ''}
          estudiantesInscritos={estudiantesInscritos}
        />
        <main className='py-4'>
          <DataTable
            columns={estudiantesCursoColumns}
            data={estudiantesInscritos}
          />
        </main>
      </div>
    </>
  );
}
