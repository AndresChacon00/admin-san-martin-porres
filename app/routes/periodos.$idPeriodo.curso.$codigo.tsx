import { useLoaderData, Form, useParams } from '@remix-run/react';
import { obtenerEstudiantesDeCursoPeriodo, inscribirEstudianteCursoPeriodo } from '~/api/controllers/estudiantesCursoPeriodo';
import { registrarPago, obtenerHistorialPagos, editarPago, calcularDeuda, eliminarPago } from '~/api/controllers/pagosEstudiantesCursos';
import { EstudiantesCursoDataTable } from '~/components/data-tables/estudiantesCurso-data-table';
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
    throw new Response('Datos inválidos', { status: 400 });
  }

  const estudiantes = await obtenerEstudiantesDeCursoPeriodo(idPeriodo, codigoCurso);

  // Calcular la deuda para cada estudiante
  const estudiantesConDeuda = await Promise.all(
    estudiantes.map(async (estudiante) => {
      if (!estudiante.id) {
        console.error('El estudiante no tiene un ID válido:', estudiante);
        return { ...estudiante, deuda: 0 };
      }

      const deudaResult = await calcularDeuda({
        idPeriodo,
        codigoCurso,
        idEstudiante: estudiante.id,
      });

      const deuda = deudaResult.type === 'success' ? deudaResult.deuda : 0;

      return {
        ...estudiante,
        deuda,
      };
    })
  );

  return estudiantesConDeuda;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const actionType = formData.get('actionType');
  const idPeriodo = Number(params.idPeriodo);
  const codigoCurso = params.codigo;

  if (!codigoCurso || isNaN(idPeriodo)) {
    return { error: 'Datos inválidos' };
  }

  if (actionType === 'agregar') {
    const idEstudiante = Number(formData.get('idEstudiante'));
    const monto = Number(formData.get('monto'));
    const fecha = formData.get('fecha') as string;
    const tipoPago = formData.get('tipoPago') as string;
    const comprobante = formData.get('comprobante') as string;

    if (isNaN(idEstudiante) || isNaN(monto) || !fecha || !tipoPago) {
      return { error: 'Datos inválidos' };
    }

    const result = await registrarPago({
      idPeriodo,
      codigoCurso,
      idEstudiante,
      monto,
      fecha: new Date(fecha),
      tipoPago,
      comprobante,
    });

    if (result.type === 'error') {
      return { error: result.message };
    }
  }

  if (actionType === 'editar') {
    const idPago = Number(formData.get('idPago'));
    const monto = Number(formData.get('monto'));
    const fecha = formData.get('fecha') as string;
    const tipoPago = formData.get('tipoPago') as string;
    const comprobante = formData.get('comprobante') as string;

    if (isNaN(idPago) || isNaN(monto) || !fecha || !tipoPago) {
      return { error: 'Datos inválidos' };
    }

    const result = await editarPago(idPago, {
      monto,
      fecha: new Date(fecha),
      tipoPago,
      comprobante,
    });

    if (result.type === 'error') {
      return { error: result.message };
    }
  }

  if (actionType === 'eliminar') {
    const idPago = Number(formData.get('idPago'));

    if (isNaN(idPago)) {
      return { error: 'ID de pago inválido' };
    }

    const result = await eliminarPago(idPago);

    if (result.type === 'error') {
      return { error: result.message };
    }
  }

  return null;
};

export default function EstudiantesCursoPage() {
  const estudiantesInscritos = useLoaderData<typeof loader>();
  const { idPeriodo, codigo } = useParams();

  return (
    <>
      <h1 className="text-xl font-bold">
        Estudiantes en el Curso {codigo} - Periodo {idPeriodo}
      </h1>
      <div className="py-4 w-3/4">
        <Dialog>
          <DialogTrigger>
            <Button className="link-button">Inscribir Estudiante</Button>
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
        <main className="py-4">
          <EstudiantesCursoDataTable
            columns={estudiantesCursoColumns}
            data={estudiantesInscritos}
            idPeriodo={Number(idPeriodo)}
            codigoCurso={String(codigo)}
          />
        </main>
      </div>
    </>
  );
}