import {
  useLoaderData,
  Form,
  useParams,
  Link,
  MetaFunction,
} from '@remix-run/react';
import {
  obtenerEstudiantesDeCursoPeriodo,
  inscribirEstudianteCursoPeriodo,
  eliminarEstudianteCursoPeriodo,
} from '~/api/controllers/estudiantesCursoPeriodo';
import {
  registrarPago,
  obtenerHistorialPagos,
  editarPago,
  calcularDeuda,
  eliminarPago,
} from '~/api/controllers/pagosEstudiantesCursos';
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
import { GenerarRelacionParticipantesDialog } from '~/components/Planillas/GenerarRelacionParticipantesDialog';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Periodos | San Martín de Porres' }];
};

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

  // Si el controlador devolvió un error, retornar arreglo vacío para evitar errores de mapeo
  if (!Array.isArray(estudiantes)) {
    console.error('Error al obtener estudiantes:', estudiantes);
    return [];
  }

  // Calcular la deuda para cada estudiante
  const estudiantesConDeuda = await Promise.all(
    estudiantes.map(async (estudiante) => {
      if (!estudiante.cedula) {
        console.error('El estudiante no tiene una cédula válida:', estudiante);
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
  const actionType = formData.get('actionType');
  const idPeriodo = Number(params.idPeriodo);
  const codigoCurso = params.codigo;

  if (!codigoCurso || isNaN(idPeriodo)) {
    return { error: 'Datos inválidos' };
  }

  // Inscribir estudiante por cédula (cliente envía actionType='inscribir')
  if (actionType === 'inscribir') {
    const cedula = String(formData.get('cedula') || '');

    if (!cedula) {
      return { error: 'Cédula inválida' };
    }

    const result = await inscribirEstudianteCursoPeriodo({
      idPeriodo,
      codigoCurso,
      cedulaEstudiante: cedula,
    });

    if (result.type === 'error') {
      return { error: result.message };
    }
  }

  if (actionType === 'agregar') {
    const cedula = String(formData.get('cedula') || '');
    const monto = Number(formData.get('monto'));
    const fecha = formData.get('fecha') as string;
    const tipoPago = formData.get('tipoPago') as string;
    const comprobante = formData.get('comprobante') as string;

    if (!cedula || isNaN(monto) || !fecha || !tipoPago) {
      return { error: 'Datos inválidos' };
    }

    const result = await registrarPago({
      idPeriodo,
      codigoCurso,
      cedulaEstudiante: cedula,
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

  if (actionType === 'eliminarEstudiante') {
    const cedula = String(formData.get('cedula') || '');

    if (!cedula) {
      return { error: 'Cédula de estudiante inválida' };
    }

    const result = await eliminarEstudianteCursoPeriodo(
      idPeriodo,
      codigoCurso,
      cedula,
    );

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
      <h1 className='text-xl font-bold'>
        Estudiantes en el Curso {codigo} - Periodo {idPeriodo}
      </h1>
      <div className='py-4 w-3/4'>
        <div className='flex gap-4'>
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
                <input type='hidden' name='actionType' value='inscribir' />
                <Label htmlFor='cedula'>Cédula Estudiante</Label>
                <Input id='cedula' name='cedula' type='text' />
                <DialogFooter>
                  <Button type='submit'>Inscribir Estudiante</Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
          {/* Botón para generar la planilla (cliente) */}
          <GenerarRelacionParticipantesDialog
            idPeriodo={Number(idPeriodo)}
            codigoCurso={String(codigo)}
            estudiantesInscritos={estudiantesInscritos}
            curso={{ nombreCurso: String(codigo) }}
          />
          {/* Nuevo botón para ver todos los pagos */}
          <Link to={`./pagos`}>
            <Button className='link-button'>Ver todos los pagos</Button>
          </Link>
        </div>
        <main className='py-4'>
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
