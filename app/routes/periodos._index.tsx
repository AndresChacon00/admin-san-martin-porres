import { useLoaderData, MetaFunction, Form } from '@remix-run/react';
import { addPeriodo, getPeriodos, updatePeriodo, deletePeriodo } from '~/api/controllers/periodos';
import { periodosColumns } from '~/components/columns/periodos-columns';
import { PeriodosDataTable } from '~/components/data-tables/periodos-data-table';
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
  return [{ title: 'Periodos | San Martín de Porres' }];
};

export async function loader() {
  const data = await getPeriodos();
  return data;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get('actionType');

  if (actionType === 'agregar') {
    const idPeriodo = Number(formData.get('idPeriodo'));
    const fechaInicio = formData.get('fechaInicio');
    const fechaFin = formData.get('fechaFin');

    if (
      isNaN(idPeriodo) ||
      typeof fechaInicio !== 'string' ||
      typeof fechaFin !== 'string'
    ) {
      return { error: 'Datos inválidos' };
    }

    await addPeriodo({
      idPeriodo,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
    });

    return null;
  }

  if (actionType === 'editar') {
    const idPeriodo = Number(formData.get('idPeriodo'));
    const fechaInicio = formData.get('fechaInicio');
    const fechaFin = formData.get('fechaFin');

    if (
      isNaN(idPeriodo) ||
      typeof fechaInicio !== 'string' ||
      typeof fechaFin !== 'string'
    ) {
      return { error: 'Datos inválidos' };
    }

    await updatePeriodo(idPeriodo, {
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
    });

    return null;
  }

  if (actionType === 'eliminar') {
    const idPeriodo = Number(formData.get('idPeriodo'));

    if (isNaN(idPeriodo)) {
      return { error: 'ID inválido' };
    }

    await deletePeriodo(idPeriodo);

    return null;
  }

  return { error: 'Acción no válida' };
};

export default function PeriodosPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-xl font-bold">Periodos</h1>
      <div className="py-4 w-3/4">
        {/* Agregar Periodo Modal */}
        <Dialog>
          <DialogTrigger>
            <Button className="link-button">Agregar Periodo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Periodo</DialogTitle>
              <DialogDescription>
                Agrega un nuevo periodo al sistema.
              </DialogDescription>
            </DialogHeader>
            <Form method="post">
              <div className="grid gap-4 py-4">
                {/* ID del Periodo */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="idPeriodo" className="text-right">
                    ID Periodo
                  </Label>
                  <Input
                    id="idPeriodo"
                    name="idPeriodo"
                    type="number"
                    className="col-span-3"
                  />
                </div>
                {/* Fecha de Inicio */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fechaInicio" className="text-right">
                    Fecha de Inicio
                  </Label>
                  <Input
                    id="fechaInicio"
                    name="fechaInicio"
                    type="date"
                    className="col-span-3"
                  />
                </div>
                {/* Fecha de Fin */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fechaFin" className="text-right">
                    Fecha de Fin
                  </Label>
                  <Input
                    id="fechaFin"
                    name="fechaFin"
                    type="date"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Agregar Periodo</Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Periodos Data Table */}
        <main className="py-4">
          {'type' in data && data.type === 'error' && (
            <p>Ocurrió un error cargando los datos</p>
          )}
          {!('type' in data) && <PeriodosDataTable columns={periodosColumns} data={data} />}
        </main>
      </div>
    </>
  );
}